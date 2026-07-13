import ReactCrop from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
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
    zoomLevel,
    minZoom,
    maxZoom,
    zoomStep,
    handleZoomChange,
    aspectRatio,
    crop,
    selectedRatioId,
    setAspectRatio,
    setCrop,
    handleImageLoad,
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
          className={styles.zoomContainer}
          style={{ transform: `scale(${zoomLevel})` }}
          onMouseDown={handleImageAreaMouseDown}
          onTouchStart={handleImageAreaMouseDown}
        >
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={handleCropComplete}
            aspect={aspectRatio ?? undefined}
            className={styles.cropWrapper}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- blob: URL cannot be used with next/image */}
            <img
              src={currentImage}
              alt={`Photo ${activeIndex + 1} of ${selectedImages.length}`}
              className={styles.image}
              onLoad={handleImageLoad}
            />
          </ReactCrop>
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
          zoomLevel={zoomLevel}
          isSliderVisible={isSliderVisible}
          minZoom={minZoom}
          maxZoom={maxZoom}
          zoomStep={zoomStep}
          onToggleSlider={toggleSlider}
          onZoomChange={handleZoomChange}
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
