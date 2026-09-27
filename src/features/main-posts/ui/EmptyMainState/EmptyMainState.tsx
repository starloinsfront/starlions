import s from "./EmptyMainState.module.css"

export const EmptyMainState = () => {
  return (
    <section className={s.container}>
      <div className={s.icon}>📷</div>

      <h2 className={s.title}>Пока нет публикаций</h2>

      <p className={s.description}>Здесь появятся первые публикации пользователей</p>
    </section>
  )
}
