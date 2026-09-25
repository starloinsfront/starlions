import { redirect } from "next/navigation"
import { ROUTES } from "@/common/constants/route"

export default function CreatePage() {
  redirect(ROUTES.feed)
}
