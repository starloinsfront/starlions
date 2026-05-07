import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useEffect, useState, type ComponentProps, type ReactNode } from "react"

import { Modal } from "./Modal"
import { Button } from "../Button/Button"

const meta = {
  title: "Components/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
    },
    className: {
      control: false,
    },
    onClose: {
      action: "closed",
    },
  },
  args: {
    open: false,
    modalTitle: "Delete Following",
    size: "md",
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

type ModalPreviewProps = Omit<ComponentProps<typeof Modal>, "children"> & {
  renderContent: (onClose: () => void) => ReactNode
}

function ModalPreview({ renderContent, ...args }: ModalPreviewProps) {
  const [isOpen, setIsOpen] = useState(args.open)

  useEffect(() => {
    setIsOpen(args.open)
  }, [args.open])

  const handleOpen = () => setIsOpen(true)

  const handleClose = () => {
    setIsOpen(false)
    args.onClose?.()
  }

  return (
    <>
      <Button onClick={handleOpen}>Open modal</Button>

      <Modal {...args} open={isOpen} onClose={handleClose}>
        {renderContent(handleClose)}
      </Modal>
    </>
  )
}

export const Default: Story = {
  render: (args) => (
    <ModalPreview
      {...args}
      renderContent={(onClose) => (
        <div
          style={{
            padding: "30px 0 36px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <p style={{ margin: 0, color: "white" }}>
            Do you really want to delete a Following "URLProfile"?
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
            }}
          >
            <Button
              onClick={() => {
                console.log("Do")
                onClose()
              }}
            >
              Yes
            </Button>

            <Button onClick={onClose}>No</Button>
          </div>
        </div>
      )}
    />
  ),
}

export const Small: Story = {
  args: {
    size: "sm",
    modalTitle: "Email sent",
  },
  render: (args) => (
    <ModalPreview
      {...args}
      renderContent={(onClose) => (
        <div
          style={{
            padding: "30px 0 36px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <p style={{ margin: 0, color: "white" }}>
            We have sent a link to confirm your email to epam@epam.com
          </p>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => {
                console.log("Do")
                onClose()
              }}
            >
              OK
            </Button>
          </div>
        </div>
      )}
    />
  ),
}

export const Large: Story = {
  args: {
    size: "lg",
    modalTitle: "Followers",
  },
  render: (args) => (
    <ModalPreview
      {...args}
      renderContent={(onClose) => (
        <div
          style={{
            padding: "30px 0 36px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            color: "white",
          }}
        >
          <div>UserName</div>
          <div>UserName</div>
          <div>URLProfile</div>
          <div>URLProfile</div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      )}
    />
  ),
}
