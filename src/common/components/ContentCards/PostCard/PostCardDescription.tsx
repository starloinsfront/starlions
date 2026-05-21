import s from "../ContentCards.module.css"

type Props = {
  description: string
  isExpanded: boolean
  onToggle: () => void
  time: string
}

export const PostCardDescription = ({ description, isExpanded, onToggle, time }: Props) => {
  return (
    <div className={s.cardMeta}>
      <span className={s.time}>{time}</span>
      <div className={s.cardDescription}>
        <p className={s.descriptionText}>{description}</p>
        <button className={s.showMore} onClick={onToggle} type="button">
          {isExpanded ? "Hide" : "Show more"}
        </button>
      </div>
    </div>
  )
}
