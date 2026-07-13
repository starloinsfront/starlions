import { DescriptionField } from "./DescriptionField/DescriptionField"
import { LocationField } from "./LocationField/LocationField"
import styles from "./PublicationStep.module.css"

type PublicationFormProps = {
  className?: string
  description: string
  location: string
  maxDescriptionLength: number
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSelectLocation: (name: string) => void
  username?: string
}

export const PublicationForm = ({
  className,
  description,
  location,
  maxDescriptionLength,
  onDescriptionChange,
  onLocationChange,
  onSelectLocation,
  username,
}: PublicationFormProps) => {
  return (
    <div className={className ?? styles.formPanel}>
      <div className={styles.profileBlock}>
        {/* eslint-disable-next-line @next/next/no-img-element -- placeholder avatar */}
        <img
          src="/images/auth/email-confirm.svg"
          alt="User avatar"
          className={styles.avatar}
        />
        <span className={styles.username}>{username}</span>
      </div>

      <DescriptionField
        description={description}
        maxDescriptionLength={maxDescriptionLength}
        onChange={onDescriptionChange}
      />

      <LocationField
        location={location}
        onChange={onLocationChange}
        onSelectLocation={onSelectLocation}
      />
    </div>
  )
}
