import "./page.css"
import { ContentCards } from "@/common/components/ContentCards/ContentCards"
import { RegisteredUsers } from "@/common/components/RegisteredUsers/RegisteredUsers"
import { Header } from "../Header/Header"

export const Page = () => {
  return (
    <div>
      <Header />
      <div className="page-content-container">
        <RegisteredUsers />
        <ContentCards />
      </div>
    </div>
  )
}
