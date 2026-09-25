/**
 * Converts a blob: URL back into a File object.
 *
 * When the user crops an image the result is a blob URL pointing to
 * an in-memory JPEG produced by canvas.toBlob().  The presign + upload
 * flow needs an actual File, so this utility fetches the blob and
 * wraps it with the original file name.
 */
export async function blobUrlToFile(blobUrl: string, originalFile: File): Promise<File> {
  const response = await fetch(blobUrl)
  const blob = await response.blob()

  return new File([blob], originalFile.name, {
    type: blob.type || originalFile.type,
    lastModified: Date.now(),
  })
}
