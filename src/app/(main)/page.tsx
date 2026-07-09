import { getMainPageData } from "@/features/main-posts/api/postsApi"
import { Main } from "@/widgets/Main/Main"

export const revalidate = 60

export default async function Home() {
  const data = await getMainPageData()

  return (
    <>
      <Main data={data} postHrefBase="/" />
    </>
  )
}
