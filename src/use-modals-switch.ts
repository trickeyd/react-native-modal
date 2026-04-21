import { useRef } from 'react'
import { ModalConfig } from './types'
import { useModal } from './use-modal'

/**
 * Mutually-exclusive modal slots: at most one entry in `modalConfigArray`
 * can be visible at a time. Under the hood this is backed by a SINGLE
 * `useModal` slot whose config is repointed at the active entry as the
 * caller's flags change.
 *
 * Why a single slot (and not one `useModal` per entry):
 *   Each `useModal` keeps a stable `useRef` id. When the active entry
 *   changes A -> B, slot A gets `isVisible=false` (starts animating out,
 *   but STAYS in the context-layer's `modalConfigs` array until its
 *   out-animation completes ~400ms later) while slot B gets
 *   `isVisible=true` (added to the array immediately). During the
 *   overlap BOTH are rendered by `ModalContextLayer`, which is how the
 *   "two modals visible, bottom one responsive" bug used to happen.
 *
 *   With one underlying slot, the layer's array holds at most one entry
 *   for any given switch. An A -> B transition becomes an in-place
 *   `updateModal` (content / animation config swap); A -> NONE closes
 *   cleanly; NONE -> B opens cleanly. Pair this with `reopenModal` (see
 *   `useModal`) to handle A -> NONE -> B happening faster than the
 *   out-animation.
 *
 * Trade-off: cross-type switches (A -> B while both are visible) no
 * longer animate between types; the modal stays mounted and its content
 * swaps. That matches what "switch" visually means and is the only way
 * to guarantee no co-render. If you need an animated crossfade between
 * two types, use two standalone `useModal` calls instead.
 */
const NOOP_CONFIG: ModalConfig = {
  renderModal: () => null as unknown as JSX.Element,
}

export const useModalsSwitch = (
  modalConfigArray: ([ModalConfig, boolean, any[]] | [ModalConfig, boolean])[],
) => {
  const numModals = useRef(modalConfigArray.length).current
  if (numModals !== modalConfigArray.length) {
    throw new Error('Length of modalConfigArray in useModalsSwitch has changed')
  }

  const activeIndex = modalConfigArray.findIndex(([, isVisible]) => isVisible)
  const active = activeIndex >= 0 ? modalConfigArray[activeIndex] : undefined

  const activeConfig = active?.[0]
  const activeDeps = active?.[2] ?? []

  useModal(
    // `useModal` requires a config even when invisible; when nothing is
    // active we pass a no-op so the slot's `renderModal` guard doesn't
    // throw, and `isVisible=false` ensures it isn't mounted.
    activeConfig ?? NOOP_CONFIG,
    !!active,
    // Include the active index so that a type switch (A -> B) forces
    // the useEffect inside `useModal` to re-run and call `updateModal`
    // / `reopenModal` with the new config.
    [activeIndex, ...activeDeps],
  )
}
