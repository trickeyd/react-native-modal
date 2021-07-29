import { useState } from 'react'
import { ModalOptions, ModalInterface } from './types'
import { useModal } from './use-modal'

export const useModalTrigger = (
  renderModal: (modalInterface: ModalInterface) => JSX.Element,
  options?: ModalOptions,
  onModalClosed?: () => void,
  onModalRemoved?: () => void,
) => {
  const [isVisible, setIsVisible] = useState(false)
  const { removeModal } = useModal(
    renderModal,
    isVisible,
    options,
    () => {
      setIsVisible(false)
      onModalClosed && onModalClosed()
    },
    onModalRemoved,
  )

  return {
    openModal: () => setIsVisible(true),
    closeModal: () => setIsVisible(false),
    removeModal,
  }
}
