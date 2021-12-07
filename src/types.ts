import { StyleProp, ViewStyle } from 'react-native'

export enum ModalAlign {
  START = 'flex-start',
  END = 'flex-end',
  CENTER = 'center',
}

export interface ModalInternalInterface {
  addModal: (
    id: string,
    onModalRemoved: () => void,
    options?: ModalConfig,
  ) => void
  closeModal: (id: string) => void
  removeModal: (id: string) => void
  updateModal: (id: string, options: ModalConfig) => void
  getModalIsMounted: (id: string) => boolean
}

export interface ModalInterface {
  onClose: () => void
  animationStage: AnimateStage
}

export interface ModalConfig {
  renderModal: (modalInterface?: ModalInterface) => JSX.Element
  onBackgroundPress?: () => void
  animationTypeIn?: AnimationType
  animationTypeOut?: AnimationType
  backgroundFadeDuration?: number
  backgroundFadeOutDelay?: number
  animationTimeIn?: number
  animationTimeOut?: number
  onModalClosed?: () => void
  onModalRemoved?: () => void
  contentContainerStyle?: StyleProp<ViewStyle>
  justifyModal?: ModalAlign
  alignModal?: ModalAlign
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
