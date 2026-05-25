import { Button } from "@/common/components/Button/Button"
import { ROUTES } from "@/common/constants/route"
import { AuthLinkExpired } from "@/features/auth/ui/AuthLinkExpired/AuthLinkExpired"
import { AuthPageSection } from "@/features/auth/ui/AuthPageSection/AuthPageSection"
import Link from "next/link"
import styles from "./RecoveryLinkExpired.module.css"

export default function RecoveryLinkExpiredPage() {
  return (
    <AuthPageSection>
      <AuthLinkExpired>
        <Button asChild className={styles.button}>
          <Link href={ROUTES.forgotPassword}>Resend link</Link>
        </Button>
      </AuthLinkExpired>
    </AuthPageSection>
  )
}
