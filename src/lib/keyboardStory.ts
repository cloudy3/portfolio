const TOTAL_FRAMES: number = 40;
const MAX_DPR = 2;
const FRAME_SCALE_FACTOR = 0.84;
const DEFAULT_BACKGROUND = "#faf8f5";
const FRAME_PREFIX = "ezgif-frame";
const FRAME_EXTENSION = "jpg";

function rgbToHex(red: number, green: number, blue: number): string {
  return `#${[red, green, blue]
    .map((value) => Math.round(value).toString(16).padStart(2, "0"))
    .join("")}`;
}

export function frameSource(index: number): string {
  const oneBased = index + 1;
  const padded = String(oneBased).padStart(3, "0");
  return `/keyboard/${FRAME_PREFIX}-${padded}.${FRAME_EXTENSION}`;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load ${src}`));
  });
}

export async function loadFrame(index: number): Promise<HTMLImageElement> {
  return loadImage(frameSource(index));
}

export function sampleFrameBackgroundColor(image: HTMLImageElement): string {
  const sampleCanvas = document.createElement("canvas");
  const sampleContext = sampleCanvas.getContext("2d");
  if (!sampleContext) return DEFAULT_BACKGROUND;

  const sampleWidth = 120;
  const sampleHeight = 120;
  sampleCanvas.width = sampleWidth;
  sampleCanvas.height = sampleHeight;
  sampleContext.drawImage(image, 0, 0, sampleWidth, sampleHeight);

  const leftEdgePixels = sampleContext.getImageData(0, 0, 1, sampleHeight).data;
  let red = 0;
  let green = 0;
  let blue = 0;
  let pixelCount = 0;

  for (let index = 0; index < leftEdgePixels.length; index += 4) {
    red += leftEdgePixels[index];
    green += leftEdgePixels[index + 1];
    blue += leftEdgePixels[index + 2];
    pixelCount += 1;
  }

  if (pixelCount === 0) return DEFAULT_BACKGROUND;
  return rgbToHex(red / pixelCount, green / pixelCount, blue / pixelCount);
}

export {
  DEFAULT_BACKGROUND,
  FRAME_SCALE_FACTOR,
  MAX_DPR,
  TOTAL_FRAMES,
};
