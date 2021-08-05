import { useRef } from 'react'
import { ModalConfig, ModalInterface } from './types'
import { useModal } from './use-modal'

export const useModalsSwitch = (
  modalConfigArray: ([ModalConfig, boolean, any[]] | [ModalConfig, boolean])[],
) => {
  const numModals = useRef(modalConfigArray.length).current
  if (numModals !== modalConfigArray.length) {
    throw new Error('Length of modalConfigArray in useModalsSwitch has changed')
  }

  for (let i = 0, visibalIsFound = false; i < numModals; i++) {
    const modalSwitchConfig = modalConfigArray[i]
    const modalConfig = modalSwitchConfig[0]
    const isVisible = visibalIsFound ? false : modalSwitchConfig[1]
    const dependencies = modalSwitchConfig[2]
    useModal(modalConfig, isVisible, dependencies)
    visibalIsFound = isVisible
  }
}
