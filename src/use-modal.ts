import { useContext, useEffect, useRef } from 'react'
import { InternalContext } from './modal-contexts'
import { ModalConfig, ModalInterface } from './types'
import { getUniqueId } from './generate-id'

export const useModal = (
  config: ModalConfig,
  isVisible: boolean,
  dependencies: any[] = [],
) => {
  const { addModal, closeModal, removeModal, updateModal } = useContext(
    InternalContext,
  )

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
      closeModal(id.current)
      isMounted.current = false
      onModalClosed && onModalClosed()
    } else if (!isMounted.current && isVisible) {
      addModal(id.current, onModalInternallyRemoved, config)
      isMounted.current = true
    } else if (isMounted.current) {
      updateModal(id.current, config)
    }
  }, [isVisible, prevDeps.current])

  return {
    removeModal: () => removeModal(id.current),
  }
}

const isShallowEqual = (prevDeps, nextDeps) =>
  !prevDeps.some((dep, index) => nextDeps[index] !== dep)
