import { useState } from 'react'
import { ModalConfig, ModalInterface } from './types'
import { useModal } from './use-modal'

export const useModalTrigger = (config: ModalConfig, dependencies?: any[]) => {
  if (!config?.renderModal) {
    throw new Error(
      'You must supply a renderModal function in your modalConfig',
    )
  }

  const onModalClosed = () => {
    setIsVisible(false)
    config.onModalClosed && config.onModalClosed()
  }

  const [isVisible, setIsVisible] = useState(false)
  const { removeModal } = useModal(
    {
      ...config,
      onModalClosed,
    },
    isVisible,
    dependencies,
  )

  return {
    openModal: () => setIsVisible(true),
    closeModal: () => setIsVisible(false),
    removeModal,
  }
}
