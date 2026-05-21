import { Icon } from "@/common/components/Icon/Icon"
import styles from "../../../../widgets/Sidebar/NavLink/NavLink.module.css"
import clsx from "clsx"
import { Modal } from "@/common/components/Modal/Modal"
import { Button } from "@/common/components/Button/Button"
import { useState } from "react"
import { useLogoutMutation } from "@/features/auth/api/useLogoutMutation"
import { useMe } from "@/features/auth/api/useMe"


export const Logout = () => {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const mutation = useLogoutMutation()

  const { data } = useMe()

  const handleLogout = () => {
    mutation.mutate()
    setIsModalOpen(false)
  }

  return (
    <>
      <div onClick={() => setIsModalOpen(true)} className={clsx(styles.navLink, "mediumText14")}>
        <Icon name="logOutOutline" />
        Log Out
      </div>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalTitle={"Log Out"}
        size={"sm"}
      >
        <p>Are you really want to log out of your account {data?.email}?</p>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "24px",
            marginTop: "30px",
          }}
        >
          <Button
            onClick={handleLogout}
            variant={"outline"}
            style={{
              width: "96px",
            }}
          >
            Yes
          </Button>
          <Button
            onClick={() => setIsModalOpen(false)}
            style={{
              width: "96px",
            }}
          >
            No
          </Button>
        </div>
      </Modal>
    </>
  )
}
