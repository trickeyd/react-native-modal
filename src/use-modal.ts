import { useContext, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { InternalContext } from './modal-contexts'
import { ModalOptions } from './types'

export const useModal = (
  renderModal: () => JSX.Element,
  isVisible: boolean,
  options?: ModalOptions,
  onModalClosed?: () => void,
) => {
  const { addModal, closeModal } = useContext(InternalContext)

  const id = useRef(uuidv4()).current
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
