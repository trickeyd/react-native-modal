import { useRef } from 'react'
import { ModalOptions, ModalInterface } from './types'
import { useModal } from './use-modal'

export const useModalsSwitch = (
  modalConfigArray: (
    | [(modalInterface: ModalInterface) => JSX.Element, boolean]
    | [(modalInterface: ModalInterface) => JSX.Element, boolean, ModalOptions]
  )[],
) => {
  const numModals = useRef(modalConfigArray.length).current
  if (numModals !== modalConfigArray.length) {
    throw new Error('Length of modalConfigArray in useModalsSwitch has changed')
  }

  for (let i = 0, visibalIsFound = false; i < numModals; i++) {
    const modalConfig = modalConfigArray[i]
    const renderModal = modalConfig[0]
    const isVisible = visibalIsFound ? false : modalConfig[1]
    useModal(renderModal, isVisible, modalConfig[2])
    visibalIsFound = isVisible
  }
}
