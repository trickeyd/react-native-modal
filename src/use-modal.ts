import { useContext, useEffect, useRef } from 'react'
import { InternalContext } from './modal-contexts'
import { ModalConfig, ModalInterface } from './types'
import { getUniqueId } from './generate-id'

export const useModal = (
  config: ModalConfig,
  isVisible: boolean,
  dependencies: any[] = [],
) => {
  const { addModal, closeModal, removeModal, updateModal, getModalIsMounted } =
    useContext(InternalContext)

  if (!config?.renderModal) {
    throw new Error(
      'You must supply a renderModal function in your modalConfig',
    )
  }

  const { onModalClosed, onModalRemoved } = config

  const id = useRef(undefined)
  if (!id.current) {
    id.current = getUniqueId()
  }

  const prevDeps = useRef(dependencies)
  if (!isShallowEqual(prevDeps.current, dependencies)) {
    prevDeps.current = dependencies
  }

  const onModalInternallyRemoved = () => {
    if (isVisible) {
      onModalClosed && onModalClosed()
    }
    onModalRemoved && onModalRemoved()
  }

  useEffect(() => {
    if (getModalIsMounted(id.current) && !isVisible) {
      closeModal(id.current)
      onModalClosed && onModalClosed()
    } else if (!getModalIsMounted(id.current) && isVisible) {
      addModal(id.current, onModalInternallyRemoved, config)
    } else if (getModalIsMounted(id.current)) {
      updateModal(id.current, config)
    }
  }, [isVisible, prevDeps.current])

  return {
    removeModal: () => removeModal(id.current),
  }
}

const isShallowEqual = (prevDeps, nextDeps) =>
  !prevDeps.some((dep, index) => nextDeps[index] !== dep)
