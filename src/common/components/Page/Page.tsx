import { Header } from "@/common/components/Header/Header"
import { RegisteredUsers } from "@/common/components/RegisteredUsers/RegisteredUsers"
import { ContentCards } from "@/common/components/ContentCards/ContentCards"
import s from "./page.module.css"

export const Page = () => {
  return (
    <div className={s.page}>
      <Header />
      <main className={s.main}>
        <RegisteredUsers />
        <ContentCards />
      </main>
    </div>
  )
}
