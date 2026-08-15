#!/usr/bin/env python3
"""Fetch a pre-subset JetBrains Mono woff2 into src/fonts/.

    python3 scripts/fetch-mono-subset.py

Same approach, and the same reasoning, as the Zen Kaku files sitting next to the
output: ask the Google CSS API for one weight with an explicit `text=` inventory
and it answers with a single @font-face pointing at a single already-subset
woff2, instead of the ~12 unicode-range chunks the normal family URL returns.

Self-hosting this face is not only about payload. Via next/font/google, Google
served the vietnamese chunk from its dynamic `/l/font?kit=...&skey=...&v=v24`
endpoint, and the `&` in that URL breaks Turbopack's font import map:

    next/font/google queries have exactly one entry

Turbopack builds the specifier `.../font?{"url":"...&skey=..."}` and then parses
everything after `?` as a query string, so each `&` inside the JSON reads as
another entry. `next build` happened to survive it; `next dev` did not. Nothing
in the app's own config could avoid it — `subsets` only controls preloading, not
which @font-face rules Google emits — so the loader had to go.

Only weight 400 is fetched. `.num` in globals.css is the sole mono consumer and
it hardcodes font-weight: 400; the 500 that next/font/google used to load was
never rendered.

Keep INVENTORY aligned with the Zen Kaku inventory. `.num` falls back to
ui-monospace per missing glyph, so a character covered by the sans face but not
this one would switch typeface mid-string.
"""

from __future__ import annotations

import re
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/fonts/JetBrainsMono-400.woff2"

FAMILY = "JetBrains Mono"
WEIGHT = 400

# `.num` carries counts, dates and durations, but the data behind it is free
# text — "96% cost reduction", "AWS-SAA-123456", "now" — so the whole printable
# ASCII range is needed, not just digits.
INVENTORY = "".join(
    [
        "".join(chr(c) for c in range(0x20, 0x7F)),  # printable ASCII
        "".join(chr(c) for c in range(0xA0, 0x100)),  # Latin-1 supplement
        "–—‘’‚‛“”„‟†‡•…‰‹›⁄",  # typographic punctuation
        "₩₪₫€₭₮₱₲₴₸₹₺₽",  # currency
        "←↑→↓↔↕⇐⇑⇒⇓",  # arrows
        "×÷±≈≠≤≥∞√∑∏∆∂∫µπΩ",  # math
        "間",  # matches the sans inventory
    ]
)

# The CSS API returns woff2 only to a browser-shaped client.
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)


def get(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read()


def main() -> None:
    query = urllib.parse.urlencode(
        {
            "family": f"{FAMILY.replace(' ', '+')}:wght@{WEIGHT}",
            "text": INVENTORY,
            "display": "swap",
        },
        safe="+@",
    )
    css = get(f"https://fonts.googleapis.com/css2?{query}").decode("utf-8")

    faces = re.findall(r"url\((https://[^)]+\.woff2|https://[^)]+)\)\s*format\('woff2'\)", css)
    if len(faces) != 1:
        raise SystemExit(
            f"expected exactly one woff2 face, got {len(faces)}. "
            "The inventory may have been split across subsets:\n" + css
        )

    payload = get(faces[0])
    if payload[:4] != b"wOF2":
        raise SystemExit(f"{faces[0]} did not return a woff2")

    TARGET.parent.mkdir(parents=True, exist_ok=True)
    TARGET.write_bytes(payload)
    print(f"{TARGET.relative_to(ROOT)}  {len(payload):,} bytes  <- {faces[0]}")


if __name__ == "__main__":
    main()
