import s from "./PostDetailSkeleton.module.css"

export const PostDetailSkeleton = () => {
  return (
    <div className={s.container}>
      {/* left media */}
      <div className={s.media}>
        <div className={s.imageSkeleton} />
      </div>

      {/* right sidebar */}
      <div className={s.sidebar}>
        {/* author */}
        <div className={s.author}>
          <div className={s.avatar} />

          <div className={s.authorText}>
            <div className={s.lineSmall} />
            <div className={s.lineTiny} />
          </div>
        </div>

        {/* description */}
        <div className={s.description}>
          <div className={s.line} />
          <div className={s.line} />
          <div className={s.lineShort} />
        </div>

        {/* comments */}
        <div className={s.comments}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div className={s.comment} key={index}>
              <div className={s.avatarSmall} />

              <div className={s.commentBody}>
                <div className={s.lineSmall} />
                <div className={s.line} />
              </div>
            </div>
          ))}
        </div>

        {/* footer */}
        <div className={s.footer}>
          <div className={s.lineSmall} />
          <div className={s.input} />
        </div>
      </div>
    </div>
  )
}
