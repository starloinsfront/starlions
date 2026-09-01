import { FILTER_PRESETS } from "../ui/CreatePostModal/FiltersStep/filters"

export async function applyFilterToImage(file: File, filterId: string | null): Promise<File> {
  if (!filterId || filterId === "normal") return file

  const preset = FILTER_PRESETS.find((f) => f.id === filterId)
  if (!preset || preset.value === "none") return file

  const img = new Image()
  const objectUrl = URL.createObjectURL(file)
  img.src = objectUrl
  await new Promise<void>((resolve) => {
    img.onload = () => resolve()
  })

  const canvas = document.createElement("canvas")
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext("2d")!
  ctx.filter = preset.value
  ctx.drawImage(img, 0, 0)

  URL.revokeObjectURL(objectUrl)

  return new Promise<File>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob!], file.name, { type: file.type }))
    }, file.type)
  })
}
