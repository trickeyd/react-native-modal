import { useContext, useEffect, useRef } from 'react'
import { InternalContext } from './modal-contexts'
import { ModalOptions, ModalInterface } from './types'
import { getUniqueId } from './generate-id'

export const useModal = (
  renderModal: (modalInterface: ModalInterface) => JSX.Element,
  isVisible: boolean,
  options?: ModalOptions,
  onModalClosed?: () => void,
  onModalRemoved?: () => void,
) => {
  const { addModal, closeModal, removeModal } = useContext(InternalContext)
  const id = useRef(getUniqueId()).current
  const isMounted = useRef(false)

  const onModalInternallyRemoved = () => {
    isMounted.current = false
    if (isVisible) {
      onModalClosed && onModalClosed()
    }
    onModalRemoved && onModalRemoved()
  }

  useEffect(() => {
    if (isMounted.current && !isVisible) {
      closeModal(id)
      isMounted.current = false
      onModalClosed && onModalClosed()
    } else if (!isMounted.current && isVisible) {
      addModal(renderModal, id, onModalInternallyRemoved, options)
      isMounted.current = true
    }
  }, [isVisible])

  return {
    removeModal: () => removeModal(id),
  }
}
