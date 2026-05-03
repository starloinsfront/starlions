import "./page.css"
import { ContentCards } from "@/common/components/ContentCards/ContentCards"
import { RegisteredUsers } from "@/common/components/RegisteredUsers/RegisteredUsers"

export const Page = () => {
  return (
    <>
      <div className="page-content-container">
        <RegisteredUsers />
        <ContentCards />
      </div>
    </>
  )
}
