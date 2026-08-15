#!/usr/bin/env python3
"""Generate browser, Apple touch, and PWA icons from assets/icon-source.png.

This intentionally has no third-party dependencies so a new favicon can be
regenerated in an otherwise minimal checkout:

    python3 scripts/generate-favicon-assets.py

The master artwork lives outside src/app/ on purpose. Next.js serves anything
named src/app/icon.png to the browser as-is, so the master's wide transparent
margin would reach Chrome's tab untouched no matter what this script did to the
other sizes. src/app/icon.png is therefore an output here, not the input.
"""

from __future__ import annotations

import math
import struct
import zlib
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/icon-source.png"

# Matches theme_color / background_color in public/site.webmanifest.
BACKGROUND = (14, 16, 20, 255)

# Kept clear on every side of the mark when trimming. Small on purpose: at 16px
# every pixel of margin is one the artwork does not get.
TRIM_PADDING = 0.04

# The master's crimson is rgb(135, 9, 35) — relative luminance 38, which all but
# disappears against Chrome's dark tab strip (rgb(32, 33, 36)). The gold ring
# carries the mark there and the monogram reads as a smudge. This lifts the
# crimson's lightness while holding its hue (~348 degrees), so it stays the same
# red rather than becoming a different one.
#
# Applied to the generated icons only; assets/icon-source.png keeps the original
# colour. A favicon serves light and dark tabs from one file, so this is a single
# compromise value, not a per-theme choice.
CRIMSON_SOURCE = (135, 9, 35)
CRIMSON_TARGET = (232, 48, 85)
# How far from CRIMSON_SOURCE a pixel can sit and still be treated as crimson.
# Gold is 201 away, teal 158, white 342, so all three are untouched. Antialiased
# pixels between them shift proportionally, which keeps the edges smooth.
CRIMSON_RANGE = 120


def paeth(left: int, above: int, upper_left: int) -> int:
    prediction = left + above - upper_left
    distances = (
        abs(prediction - left),
        abs(prediction - above),
        abs(prediction - upper_left),
    )
    return (left, above, upper_left)[distances.index(min(distances))]


def read_png(path: Path) -> tuple[int, int, bytearray]:
    data = path.read_bytes()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError(f"{path} is not a PNG")

    offset = 8
    width = height = None
    chunks: list[bytes] = []
    while offset < len(data):
        length = struct.unpack(">I", data[offset : offset + 4])[0]
        kind = data[offset + 4 : offset + 8]
        chunk = data[offset + 8 : offset + 8 + length]
        offset += length + 12
        if kind == b"IHDR":
            width, height, bit_depth, colour_type, compression, filtering, interlace = struct.unpack(
                ">IIBBBBB", chunk
            )
            if (bit_depth, colour_type, compression, filtering, interlace) != (8, 6, 0, 0, 0):
                raise ValueError("Only non-interlaced RGBA PNGs are supported")
        elif kind == b"IDAT":
            chunks.append(chunk)
        elif kind == b"IEND":
            break

    if width is None or height is None:
        raise ValueError("PNG is missing IHDR")

    raw = zlib.decompress(b"".join(chunks))
    stride = width * 4
    pixels = bytearray(width * height * 4)
    previous = bytearray(stride)
    index = 0
    for y in range(height):
        filter_type = raw[index]
        index += 1
        row = bytearray(raw[index : index + stride])
        index += stride
        for x in range(stride):
            left = row[x - 4] if x >= 4 else 0
            above = previous[x]
            upper_left = previous[x - 4] if x >= 4 else 0
            if filter_type == 1:
                row[x] = (row[x] + left) & 0xFF
            elif filter_type == 2:
                row[x] = (row[x] + above) & 0xFF
            elif filter_type == 3:
                row[x] = (row[x] + ((left + above) >> 1)) & 0xFF
            elif filter_type == 4:
                row[x] = (row[x] + paeth(left, above, upper_left)) & 0xFF
            elif filter_type != 0:
                raise ValueError(f"Unsupported PNG filter: {filter_type}")
        start = y * stride
        pixels[start : start + stride] = row
        previous = row
    return width, height, pixels


def brighten_crimson(pixels: bytearray) -> bytearray:
    """Shift the monogram's crimson toward CRIMSON_TARGET, leaving other inks alone.

    Weighting the shift by each pixel's distance from the source crimson means
    the flat interior moves the whole way while antialiased edges — part crimson,
    part gold or paper — move proportionally. A hard hue test would have left a
    seam exactly where the two inks meet.
    """
    shift = [target - source for target, source in zip(CRIMSON_TARGET, CRIMSON_SOURCE)]
    result = bytearray(pixels)
    for offset in range(0, len(pixels), 4):
        if not pixels[offset + 3]:
            continue
        distance = math.sqrt(
            sum((pixels[offset + channel] - CRIMSON_SOURCE[channel]) ** 2 for channel in range(3))
        )
        if distance >= CRIMSON_RANGE:
            continue
        weight = 1 - distance / CRIMSON_RANGE
        for channel in range(3):
            value = pixels[offset + channel] + weight * shift[channel]
            result[offset + channel] = max(0, min(255, round(value)))
    return result


def premultiply(pixels: bytearray) -> bytearray:
    """Scale colour by alpha so the resize filter cannot blend it with transparent black.

    PNG stores straight alpha, and every fully transparent pixel in the master
    carries RGB (0, 0, 0). Averaging those channels directly drags edge pixels
    toward black, which is what turned the gold ring brown at favicon sizes: the
    artwork is thin brush strokes, so at 16px almost every output pixel is an
    edge pixel.
    """
    result = bytearray(len(pixels))
    for offset in range(0, len(pixels), 4):
        alpha = pixels[offset + 3]
        for channel in range(3):
            result[offset + channel] = (pixels[offset + channel] * alpha + 127) // 255
        result[offset + 3] = alpha
    return result


def unpremultiply(pixels: bytearray) -> bytearray:
    """Undo premultiply() so the result can be written as a normal PNG."""
    result = bytearray(len(pixels))
    for offset in range(0, len(pixels), 4):
        alpha = pixels[offset + 3]
        if alpha:
            for channel in range(3):
                # Lanczos undershoot can leave colour slightly above alpha, which
                # is not a representable premultiplied value; clamp it back.
                result[offset + channel] = min(255, round(pixels[offset + channel] * 255 / alpha))
        result[offset + 3] = alpha
    return result


def alpha_bounds(pixels: bytearray, width: int, height: int, threshold: int = 8) -> tuple[int, int, int, int]:
    """Bounding box of the pixels whose alpha clears `threshold`."""
    left, top, right, bottom = width, height, -1, -1
    for y in range(height):
        row = y * width
        for x in range(width):
            if pixels[(row + x) * 4 + 3] > threshold:
                if x < left:
                    left = x
                if x > right:
                    right = x
                if y < top:
                    top = y
                bottom = y
    if right < 0:
        raise ValueError(f"{SOURCE} is fully transparent")
    return left, top, right, bottom


def square_trim(pixels: bytearray, width: int, height: int) -> tuple[bytearray, int]:
    """Crop to a square centred on the artwork, keeping TRIM_PADDING clear each side.

    The master is mostly empty margin — the mark covers a little over half the
    canvas — so resizing it whole spent most of a 16x16 frame on transparency and
    left nothing at full opacity. Cropping first means every later resize spends
    its whole output on the mark.
    """
    left, top, right, bottom = alpha_bounds(pixels, width, height)
    side = max(right - left + 1, bottom - top + 1)
    side += 2 * round(side * TRIM_PADDING)
    origin_x = (left + right) // 2 - side // 2
    origin_y = (top + bottom) // 2 - side // 2

    # The square may reach past the master's edge; anything outside stays transparent.
    cropped = bytearray(side * side * 4)
    for y in range(side):
        source_y = origin_y + y
        if not 0 <= source_y < height:
            continue
        for x in range(side):
            source_x = origin_x + x
            if not 0 <= source_x < width:
                continue
            source_offset = (source_y * width + source_x) * 4
            target_offset = (y * side + x) * 4
            cropped[target_offset : target_offset + 4] = pixels[source_offset : source_offset + 4]
    return cropped, side


def lanczos(value: float) -> float:
    if value == 0:
        return 1.0
    if abs(value) >= 3:
        return 0.0
    return (math.sin(math.pi * value) / (math.pi * value)) * (
        math.sin(math.pi * value / 3) / (math.pi * value / 3)
    )


def resize(source: bytearray, source_width: int, source_height: int, target_width: int, target_height: int) -> bytearray:
    """Resize premultiplied RGBA pixels with a Lanczos-3 reconstruction filter."""
    horizontal = bytearray(target_width * source_height * 4)
    scale_x = source_width / target_width
    support_x = max(1.0, scale_x)
    for y in range(source_height):
        for x in range(target_width):
            center = (x + 0.5) * scale_x - 0.5
            start = max(0, math.ceil(center - 3 * support_x))
            end = min(source_width - 1, math.floor(center + 3 * support_x))
            samples = []
            total = 0.0
            for sample_x in range(start, end + 1):
                weight = lanczos((sample_x - center) / support_x)
                if weight:
                    samples.append((sample_x, weight))
                    total += weight
            output = (y * target_width + x) * 4
            for channel in range(4):
                value = sum(source[(y * source_width + sample_x) * 4 + channel] * weight for sample_x, weight in samples)
                horizontal[output + channel] = max(0, min(255, round(value / total)))

    target = bytearray(target_width * target_height * 4)
    scale_y = source_height / target_height
    support_y = max(1.0, scale_y)
    for y in range(target_height):
        center = (y + 0.5) * scale_y - 0.5
        start = max(0, math.ceil(center - 3 * support_y))
        end = min(source_height - 1, math.floor(center + 3 * support_y))
        samples = []
        total = 0.0
        for sample_y in range(start, end + 1):
            weight = lanczos((sample_y - center) / support_y)
            if weight:
                samples.append((sample_y, weight))
                total += weight
        for x in range(target_width):
            output = (y * target_width + x) * 4
            for channel in range(4):
                value = sum(horizontal[(sample_y * target_width + x) * 4 + channel] * weight for sample_y, weight in samples)
                target[output + channel] = max(0, min(255, round(value / total)))
    return target


def scaled(source: bytearray, source_size: int, target_size: int) -> bytearray:
    """Resize premultiplied square artwork down to straight-alpha output pixels."""
    return unpremultiply(resize(source, source_size, source_size, target_size, target_size))


def png_chunk(kind: bytes, data: bytes) -> bytes:
    return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)


def png_bytes(width: int, height: int, pixels: bytearray) -> bytes:
    rows = b"".join(b"\0" + pixels[y * width * 4 : (y + 1) * width * 4] for y in range(height))
    return b"\x89PNG\r\n\x1a\n" + png_chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)) + png_chunk(b"IDAT", zlib.compress(rows, 9)) + png_chunk(b"IEND", b"")


def save_png(path: Path, width: int, height: int, pixels: bytearray) -> bytes:
    result = png_bytes(width, height, pixels)
    path.write_bytes(result)
    return result


def write_ico(path: Path, image_data: list[tuple[int, bytes]]) -> None:
    header = struct.pack("<HHH", 0, 1, len(image_data))
    directory_size = 16 * len(image_data)
    offset = len(header) + directory_size
    entries = []
    payloads = []
    for size, data in image_data:
        entries.append(struct.pack("<BBBBHHII", size if size < 256 else 0, size if size < 256 else 0, 0, 0, 1, 32, len(data), offset))
        payloads.append(data)
        offset += len(data)
    path.write_bytes(header + b"".join(entries) + b"".join(payloads))


def maskable_canvas(source: bytearray, source_size: int, size: int) -> bytearray:
    """Place the artwork inside the maskable icon safe zone on the site colour.

    A maskable icon may be cropped to a circle 80% of the icon's width, so the
    mark is inset to exactly that circle. The inset is only meaningful now that
    `source` is trimmed — applied to the untrimmed master it stacked on top of
    the margin the master already had and left the mark tiny inside the safe zone.
    """
    inset = round(size * 0.1)
    artwork_size = size - inset * 2
    # Stays premultiplied: `colour + background * (1 - alpha)` is then a plain
    # `over`, with no second chance to reintroduce the transparent-black blend.
    artwork = resize(source, source_size, source_size, artwork_size, artwork_size)
    canvas = bytearray(BACKGROUND * (size * size))
    for y in range(artwork_size):
        for x in range(artwork_size):
            source_offset = (y * artwork_size + x) * 4
            target_offset = ((y + inset) * size + x + inset) * 4
            transparency = 1 - artwork[source_offset + 3] / 255
            for channel in range(3):
                background = canvas[target_offset + channel]
                canvas[target_offset + channel] = min(
                    255, round(artwork[source_offset + channel] + background * transparency)
                )
            canvas[target_offset + 3] = 255
    return canvas


def main() -> None:
    source_width, source_height, source = read_png(SOURCE)
    trimmed, size_of_art = square_trim(source, source_width, source_height)
    art = premultiply(brighten_crimson(trimmed))
    print(f"master {source_width}x{source_height} -> trimmed {size_of_art}x{size_of_art}")

    app_dir = ROOT / "src/app"
    public_dir = ROOT / "public"

    # Next.js serves this one directly; 512 is plenty for a tab or a bookmark and
    # keeps the browser's own downscale short.
    save_png(app_dir / "icon.png", 512, 512, scaled(art, size_of_art, 512))
    save_png(app_dir / "apple-icon.png", 180, 180, scaled(art, size_of_art, 180))

    favicon_images = []
    for size in (16, 32, 48):
        favicon_images.append((size, png_bytes(size, size, scaled(art, size_of_art, size))))
    write_ico(app_dir / "favicon.ico", favicon_images)

    for size in (192, 512):
        save_png(public_dir / f"web-app-manifest-{size}x{size}.png", size, size, scaled(art, size_of_art, size))
        save_png(
            public_dir / f"web-app-manifest-{size}x{size}-maskable.png",
            size,
            size,
            maskable_canvas(art, size_of_art, size),
        )


if __name__ == "__main__":
    main()
