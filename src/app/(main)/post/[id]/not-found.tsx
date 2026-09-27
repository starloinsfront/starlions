import { ROUTES } from "@/common/constants/route"
import { NotFoundView } from "@/widgets/NotFoundView/NotFoundView"

export default function PostNotFound() {
  return (
    <NotFoundView
      description="This post may have been deleted by its author, or the link is no longer available."
      label="Post unavailable"
      primaryHref={ROUTES.home}
      primaryLabel="Go to Feed"
      showBackButton
      title="This post is no longer available"
    />
  )
}
