import type { Area } from "react-easy-crop"

import {
  AVATAR_OUTPUT_QUALITY,
  AVATAR_OUTPUT_SIZE,
  AVATAR_OUTPUT_TYPE,
} from "../../model/avatarFile"

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
): Promise<File> {
  const blob = await renderCropToBlob(imgElement, croppedAreaPixels)

  return new File([blob], fileName, { type: AVATAR_OUTPUT_TYPE })
}

// Why: The core of all logic—draws the cut-out area of ​​the image on an invisible canvas and exports the result as a JPEG blob.

async function renderCropToBlob(
  imgElement: HTMLImageElement,
  croppedAreaPixels: Area,
): Promise<Blob> {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("Canvas is not supported")
  }

  canvas.width = AVATAR_OUTPUT_SIZE
  canvas.height = AVATAR_OUTPUT_SIZE
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"

  ctx.drawImage(
    imgElement,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    AVATAR_OUTPUT_SIZE,
    AVATAR_OUTPUT_SIZE,
  )

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to encode the cropped avatar"))
          return
        }

        resolve(blob)
      },
      AVATAR_OUTPUT_TYPE,
      AVATAR_OUTPUT_QUALITY,
    )
  })
}
