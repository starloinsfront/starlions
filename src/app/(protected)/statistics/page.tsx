import s from "../feed/page.module.css"

export default function StatisticsPage() {
  return (
    <section className={s.page}>
      <h1 className={s.title}>Statistics</h1>
      <p className={s.description}>
        This protected page is available only for authenticated users and is opened from the
        sidebar route /statistics.
      </p>
    </section>
  )
}
