import "./page.css"
import { Header } from "@/common/components/Header/Header"
import { RegisteredUsers } from "@/common/components/RegisteredUsers/RegisteredUsers"
import { ContentCards } from "@/common/components/ContentCards/ContentCards"

export const Page = () => {
  return (
    <div>
      <Header />
      <RegisteredUsers />
      <ContentCards />
    </div>
  )
}
