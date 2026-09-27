import { ROUTES } from "@/common/constants/route"
import { NotFoundView } from "@/widgets/NotFoundView/NotFoundView"

export default function ProfileNotFound() {
  return (
    <NotFoundView
      description="This profile may have been deleted, suspended, or the link may be incorrect."
      label="Profile unavailable"
      primaryHref={ROUTES.home}
      primaryLabel="Go to Feed"
      showBackButton
      title="This profile is no longer available"
    />
  )
}
