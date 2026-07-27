import Cropper from "react-easy-crop"
import "react-easy-crop/react-easy-crop.css"
import { CroppingStepHeader } from "./CroppingStepHeader/CroppingStepHeader"
import { CarouselNavigation } from "../CarouselNavigation/CarouselNavigation"
import { CroppingToolbar } from "./CroppingToolbar/CroppingToolbar"
import { MiniGallery } from "./MiniGallery/MiniGallery"
import { CropOptionsPanel } from "./CropOptionsPanel/CropOptionsPanel"
import { useCroppingStep } from "./hooks/useCroppingStep"
import styles from "./CroppingStep.module.css"
import type { CroppingStepProps } from "./CroppingStep.types"

export const CroppingStep = ({
  photos,
  selectedImages,
  croppedImages,
  onBack,
  onNext,
  onCropImage,
  onAddMoreFiles,
  onRemoveImage,
}: CroppingStepProps) => {
  const {
    activeIndex,
    goToSlide,
    showNext,
    showPrev,
    isCropOptionsOpen,
    isSliderVisible,
    isGalleryPanelOpen,
    toggleCropOptions,
    toggleSlider,
    toggleGallery,
    zoom,
    setZoom,
    aspectRatio,
    cropPosition,
    selectedRatioId,
    setAspectRatio,
    handleCropChange,
    handleCropComplete,
    fileInputRef,
    triggerFileInput,
    handleFileChange,
    cropOptionsRef,
    toolbarRef,
    galleryRef,
    imageAreaRef,
    currentImage,
    isAtLimit,
    isProcessing,
    handleNext,
    handleBack,
    handleImageAreaMouseDown,
  } = useCroppingStep({
    photos,
    selectedImages,
    croppedImages,
    onBack,
    onNext,
    onCropImage,
    addMoreFiles: onAddMoreFiles,
    removeImage: onRemoveImage,
  })

  return (
    <div className={styles.step}>
      <CroppingStepHeader
        onBack={handleBack}
        onNext={handleNext}
        isNextDisabled={isProcessing}
      />

      <div
        className={styles.imageArea}
        ref={imageAreaRef}
      >
        <div
          className={styles.cropperContainer}
          onMouseDown={handleImageAreaMouseDown}
          onTouchStart={handleImageAreaMouseDown}
        >
          <Cropper
            image={currentImage}
            crop={cropPosition}
            zoom={zoom}
            aspect={aspectRatio ?? 1}
            onCropChange={handleCropChange}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            cropShape="rect"
            showGrid={false}
            zoomSpeed={0.1}
            restrictPosition={false}
            style={{
              containerStyle: { width: "100%", height: "100%" },
            }}
          />
        </div>

        <CarouselNavigation
          count={selectedImages.length}
          activeIndex={activeIndex}
          onPrev={showPrev}
          onNext={showNext}
          onGoToSlide={goToSlide}
        />

        <CroppingToolbar
          ref={toolbarRef}
          isGalleryOpen={isGalleryPanelOpen}
          isCropOptionsOpen={isCropOptionsOpen}
          onToggleGallery={toggleGallery}
          onToggleCropOptions={toggleCropOptions}
          zoomLevel={zoom}
          isSliderVisible={isSliderVisible}
          minZoom={1}
          maxZoom={3}
          zoomStep={0.01}
          onToggleSlider={toggleSlider}
          onZoomChange={(value) => setZoom(value[0] ?? 1)}
        />

        <CropOptionsPanel
          ref={cropOptionsRef}
          selectedOptionId={selectedRatioId}
          onSelect={(option) => setAspectRatio(option.value)}
          isOpen={isCropOptionsOpen}
        />

        <MiniGallery
          ref={galleryRef}
          images={selectedImages}
          activeIndex={activeIndex}
          onSelectSlide={goToSlide}
          onRemoveImage={onRemoveImage}
          onAddClick={triggerFileInput}
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
          isAtLimit={isAtLimit}
          currentCount={selectedImages.length}
          isOpen={isGalleryPanelOpen}
        />
      </div>
    </div>
  )
}
