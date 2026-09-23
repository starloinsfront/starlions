"use client"

import Cropper from "react-easy-crop"
import "react-easy-crop/react-easy-crop.css"
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
    cropPosition,
    zoom,
    isSaving,
    isCropReady,
    showCloseConfirm,
    fileInputRef,
    setZoom,
    setCropPosition,
    requestClose,
    confirmClose,
    cancelClose,
    handleBack,
    handleSave,
    handleCropComplete,
    triggerFileInput,
    handleFileChange,
  } = hook

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
            <CompoundModal.Description>
              {step === "upload"
                ? "Choose a JPEG or PNG profile photo up to 10 MB."
                : "Move and zoom the photo to choose the square avatar area."}
            </CompoundModal.Description>
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
                      aria-label="Profile photo zoom"
                    />
                    <Icon name="expandOutline" width={20} height={20} className={s.sliderIcon} />
                  </div>

                  <div className={s.cropActions}>
                    <Button
                      disabled={isSaving}
                      onClick={handleBack}
                      type="button"
                      variant="outline"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSave}
                      isLoading={isSaving}
                      disabled={isSaving || !isCropReady}
                      aria-busy={isSaving}
                      aria-label={isSaving ? "Saving profile photo" : "Save profile photo"}
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
