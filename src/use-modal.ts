import { useContext, useEffect, useRef } from 'react'
import { InternalContext } from './modal-contexts'
import { ModalOptions } from './types'
import { getUniqueId } from './generate-id'

export const useModal = (
  renderModal: () => JSX.Element,
  isVisible: boolean,
  options?: ModalOptions,
  onModalClosed?: () => void,
) => {
  const { addModal, closeModal } = useContext(InternalContext)

  const id = useRef(getUniqueId()).current

  const isMounted = useRef(false)

  useEffect(() => {
    if (isMounted.current && !isVisible) {
      closeModal(id)
      isMounted.current = false
      onModalClosed && onModalClosed()
    } else if (!isMounted.current && isVisible) {
      addModal(renderModal, id, options)
      isMounted.current = true
    }
  }, [isVisible])
}
