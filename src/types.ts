export interface ModalInternalInterface {
  addModal: (
    renderModal: () => JSX.Element,
    id: string,
    options?: ModalOptions,
  ) => void
  closeModal: (id: string) => void
}

export interface ModalInterface {
  onClose: () => void
  animationStage: AnimateStage
}

export interface ModalOptions {
  onBackgroundPress?: () => void
  animationTypeIn?: AnimationType
  animationTypeOut?: AnimationType
  backgroundFadeDuration?: number
  backgroundFadeOutDelay?: number
  animationTimeIn?: number
  animationTimeOut?: number
}

export enum AnimateStage {
  ANIMATE_IN = 'AnimateStage.ANIMATE_IN',
  IN = 'AnimateStage.IN',
  ANIMATE_OUT = 'AnimateStage.ANIMATE_OUT',
  COMPLETE = 'AnimateStage.COMPLETE',
}

export enum AnimationType {
  FADE = 'AnimationType.FADE',
  SLIDE_TOP = 'AnimationType.SLIDE_TOP',
  SLIDE_BOTTOM = 'AnimationType.SLIDE_BOTTOM',
  SLIDE_RIGHT = 'AnimationType.SLIDE_RIGHT',
  SLIDE_LEFT = 'AnimationType.SLIDE_LEFT',
}
