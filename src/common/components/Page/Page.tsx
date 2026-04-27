import { ContentCards } from "@/common/components/ContentCards/ContentCards"
import { RegisteredUsers } from "@/common/components/RegisteredUsers/RegisteredUsers"
import "./page.css"

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
