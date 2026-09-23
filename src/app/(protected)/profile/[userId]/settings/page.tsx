import { ProfileSettingsPageClient } from "./ProfileSettingsPageClient"

type Props = {
  params: Promise<{
    userId: string
  }>
}

export default async function SettingsPage({ params }: Props) {
  const { userId } = await params

  return <ProfileSettingsPageClient userId={userId} />
}
