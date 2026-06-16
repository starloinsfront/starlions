import {
  centerCrop,
  makeAspectCrop,
  type PercentCrop,
  type PixelCrop,
} from "react-image-crop"

/** Generate a centered crop for a given aspect ratio and image dimensions */
export function generateCrop(width: number, height: number, ratio: number): PercentCrop {
  const crop = centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, ratio, width, height),
    width,
    height,
  )
  return {
    x: crop.x as number,
    y: crop.y as number,
    width: crop.width as number,
    height: crop.height as number,
    unit: "%",
  }
}

/** Load an image URL into an off-screen HTMLImageElement and resolve when ready. */
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

/**
 * Render a crop region from an already-loaded image element onto a canvas
 * and return the result as a JPEG blob URL.
 */
export async function renderCropFromElement(
  imgElement: HTMLImageElement,
  percentCrop: PercentCrop,
): Promise<string | null> {
  // IMPORTANT: Use naturalWidth/naturalHeight (actual image file size)
  // because drawImage works with the natural image, not CSS display size
  const { naturalWidth, naturalHeight } = imgElement
  const pixelCrop: PixelCrop = {
    x: (percentCrop.x / 100) * naturalWidth,
    y: (percentCrop.y / 100) * naturalHeight,
    width: (percentCrop.width / 100) * naturalWidth,
    height: (percentCrop.height / 100) * naturalHeight,
    unit: "px",
  }

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) return null

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    imgElement,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  )

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.95),
  )
  if (!blob) return null

  return URL.createObjectURL(blob)
}
