import type { MainPageData } from "@/features/main-posts/model/post.types"
import { ContentCards } from "@/features/main-posts/ui/ContentCards/ContentCards"
import { EmptyMainState } from "@/features/main-posts/ui/EmptyMainState/EmptyMainState"
import { RegisteredUsers } from "@/features/main-posts/ui/RegisteredUsers/RegisteredUsers"

import s from "./Main.module.css"

type Props = {
  data: MainPageData | null
  postHrefBase?: string
}

export const Main = ({ data, postHrefBase = "/" }: Props) => {
  if (!data) {
    return <EmptyMainState />
  }

  return (
    <div className={s.pageContentContainer}>
      <div className={s.mainRegisteredUsers}>
        <RegisteredUsers count={data.usersCount} />
      </div>
      {data.posts.length > 0 ? (
        <ContentCards posts={data.posts} postHrefBase={postHrefBase} />
      ) : (
        <EmptyMainState />
      )}
    </div>
  )
}
