import styles from "./DescriptionField.module.css"

type DescriptionFieldProps = {
  description: string
  maxDescriptionLength: number
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export const DescriptionField = ({
  description,
  maxDescriptionLength,
  onChange,
}: DescriptionFieldProps) => {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel} htmlFor="pub-description">
        Add publication descriptions
      </label>
      <div className={styles.textareaWrapper}>
        <textarea
          id="pub-description"
          className={styles.textarea}
          placeholder="Text-area"
          value={description}
          onChange={onChange}
          maxLength={maxDescriptionLength}
        />
        <span className={styles.charCounter}>
          {description.length}/{maxDescriptionLength}
        </span>
      </div>
    </div>
  )
}
