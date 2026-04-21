import { useContext, useEffect, useRef } from 'react'
import { InternalContext } from './modal-contexts'
import { ModalConfig, ModalInterface } from './types'
import { getUniqueId } from './generate-id'

export const useModal = (
  config: ModalConfig,
  isVisible: boolean,
  dependencies: any[] = [],
) => {
  const {
    addModal,
    closeModal,
    removeModal,
    updateModal,
    reopenModal,
    getModalIsMounted,
  } = useContext(InternalContext)

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

  // Tracks the last `isVisible` value the effect saw. Used to detect a
  // false -> true flip while the modal is still in the tree (mid
  // out-animation), which must be handled as `reopenModal` rather than
  // `updateModal` or the modal would finish animating out.
  const prevIsVisible = useRef(isVisible)

  const onModalInternallyRemoved = () => {
    if (isVisible) {
      onModalClosed && onModalClosed()
    }
    onModalRemoved && onModalRemoved()
  }

  useEffect(() => {
    const wasVisible = prevIsVisible.current
    prevIsVisible.current = isVisible
    const mounted = getModalIsMounted(id.current)

    if (!isVisible && mounted) {
      closeModal(id.current)
      onModalClosed && onModalClosed()
    } else if (isVisible && !mounted) {
      addModal(id.current, onModalInternallyRemoved, config)
    } else if (isVisible && mounted && !wasVisible) {
      // Caller toggled isVisible false -> true while we were mid-close.
      // Cancel the close and swap in the new config in one atomic op.
      reopenModal(id.current, config)
    } else if (isVisible && mounted) {
      updateModal(id.current, config)
    }
  }, [isVisible, prevDeps.current])

  return {
    removeModal: () => removeModal(id.current),
  }
}

const isShallowEqual = (prevDeps, nextDeps) =>
  !prevDeps.some((dep, index) => nextDeps[index] !== dep)
