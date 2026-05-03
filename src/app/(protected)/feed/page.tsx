import s from "./page.module.css"

export default function FeedPage() {
  return (
    <section className={s.page}>
      <h1 className={s.title}>Feed</h1>
      <p className={s.description}>
        This protected page is available only for authenticated users and is opened from the
        sidebar route /feed.
      </p>
    </section>
  )
}
