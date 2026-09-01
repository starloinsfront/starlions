"use client"

import { useState } from "react"
import Cropper from "react-easy-crop"
import "react-easy-crop/react-easy-crop.css"
import type { Point } from "react-easy-crop"
import { CompoundModal } from "@/common/components/CompoundModal/CompoundModal"
import { ConfirmationModal } from "@/common/components/ConfirmationModal/ConfirmationModal"
import { Button } from "@/common/components/Button/Button"
import { Icon } from "@/common/components/Icon/Icon"
import type { useAvatarUpload } from "./useAvatarUpload"
import s from "./AvatarUploadModal.module.css"

type Props = {
  hook: ReturnType<typeof useAvatarUpload>
}

export const AvatarUploadModal = ({ hook }: Props) => {
  const {
    isOpen,
    step,
    previewUrl,
    zoom,
    isSaving,
    showCloseConfirm,
    fileInputRef,
    setZoom,
    requestClose,
    confirmClose,
    cancelClose,
    handleBack,
    handleSave,
    handleCropComplete,
    triggerFileInput,
    handleFileChange,
  } = hook

  const [cropPosition, setCropPosition] = useState<Point>({ x: 0, y: 0 })

  return (
    <>
      <CompoundModal.Root open={isOpen} onOpenChange={(open) => !open && requestClose()}>
        <CompoundModal.Portal>
          <CompoundModal.Overlay />
          <CompoundModal.Content className={s.content}>
            <CompoundModal.Header>
              <CompoundModal.Title>
                {step === "upload" ? "Add Profile Photo" : "Crop Photo"}
              </CompoundModal.Title>
              <CompoundModal.Close />
            </CompoundModal.Header>
            <CompoundModal.MainContent>
              {step === "upload" && (
                <div className={s.uploadStep}>
                  <div className={s.uploadPlaceholder}>
                    <Icon name="imageOutline" width={48} height={48} className={s.uploadIcon} />
                    <p className={s.uploadText}>Select a photo to upload</p>
                    <Button type="button" onClick={triggerFileInput}>
                      Select from Computer
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    className={s.hiddenInput}
                    onChange={handleFileChange}
                    aria-hidden
                    tabIndex={-1}
                  />
                </div>
              )}

              {step === "crop" && previewUrl && (
                <div className={s.cropStep}>
                  <div className={s.cropperContainer}>
                    <Cropper
                      image={previewUrl}
                      crop={cropPosition}
                      zoom={zoom}
                      aspect={1}
                      cropShape="round"
                      showGrid={false}
                      onCropChange={setCropPosition}
                      onZoomChange={setZoom}
                      onCropComplete={handleCropComplete}
                      zoomSpeed={0.1}
                      style={{
                        containerStyle: { width: "100%", height: "100%" },
                      }}
                    />
                  </div>

                  <div className={s.toolbar}>
                    <Icon name="imageOutline" width={20} height={20} className={s.sliderIcon} />
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.01}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className={s.slider}
                    />
                    <Icon name="expandOutline" width={20} height={20} className={s.sliderIcon} />
                  </div>

                  <div className={s.cropActions}>
                    <Button type="button" variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSave}
                      isLoading={isSaving}
                      disabled={isSaving}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </CompoundModal.MainContent>
          </CompoundModal.Content>
        </CompoundModal.Portal>
      </CompoundModal.Root>

      <ConfirmationModal
        isOpen={showCloseConfirm}
        title="Close"
        message="Do you really want to close the photo upload?\nYour changes will not be saved"
        discardBtnText="Yes, close"
        confirmBtnText="No"
        onDiscard={confirmClose}
        onConfirm={cancelClose}
        onClose={cancelClose}
      />
    </>
  )
}
