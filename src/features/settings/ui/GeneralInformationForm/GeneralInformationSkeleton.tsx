import { Skeleton } from "@/common/components/Skeleton/Skeleton"

import s from "./GeneralInformationForm.module.css"

const FIELD_LABEL_WIDTHS = [88, 76, 74, 92] as const

const FieldSkeleton = ({ labelWidth }: { labelWidth: number }) => (
  <div className={s.skeletonField}>
    <Skeleton className={s.skeletonLabel} style={{ width: labelWidth }} />
    <Skeleton className={s.skeletonInput} />
  </div>
)

export const GeneralInformationSkeleton = () => (
  <div aria-live="polite" className={s.form} role="status">
    <span className={s.srOnly}>Loading profile settings</span>

    <div className={s.formBody}>
      <div className={`${s.avatarColumn} ${s.skeletonAvatarColumn}`}>
        <Skeleton className={s.skeletonAvatar} />
        <Skeleton className={s.skeletonPhotoButton} />
      </div>

      <div className={s.fieldsColumn}>
        {FIELD_LABEL_WIDTHS.map((labelWidth) => (
          <FieldSkeleton key={labelWidth} labelWidth={labelWidth} />
        ))}

        <div className={s.locationRow}>
          <FieldSkeleton labelWidth={128} />
          <FieldSkeleton labelWidth={106} />
        </div>

        <div className={s.skeletonField}>
          <Skeleton className={s.skeletonLabel} style={{ width: 66 }} />
          <Skeleton className={s.skeletonTextArea} />
          <Skeleton className={s.skeletonCounter} />
        </div>
      </div>
    </div>

    <div className={s.actions}>
      <Skeleton className={s.skeletonSaveButton} />
    </div>
  </div>
)
