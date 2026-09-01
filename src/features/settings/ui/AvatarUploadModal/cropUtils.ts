import type { Area } from "react-easy-crop"

//Why: Converts a URL string (either a blob URL or a regular link) into a ready-to-use HTMLImageElement object—that is, it loads the image into the browser's memory.

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

// Why: Cuts out a user-selected area from an image and returns a finished File object that can be sent to the server.

export async function renderCropToFile(
  imgElement: HTMLImageElement,
  croppedAreaPixels: Area,
  fileName = "avatar.jpg",
): Promise<File | null> {
  const blob = await renderCropToBlob(imgElement, croppedAreaPixels)
  if (!blob) return null

  return new File([blob], fileName, { type: "image/jpeg" })
}

// Why: The core of all logic—draws the cut-out area of ​​the image on an invisible canvas and exports the result as a JPEG blob.

async function renderCropToBlob(
  imgElement: HTMLImageElement,
  croppedAreaPixels: Area,
): Promise<Blob | null> {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) return null

  canvas.width = croppedAreaPixels.width
  canvas.height = croppedAreaPixels.height

  ctx.drawImage(
    imgElement,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
  )

  return new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.95),
  )
}
