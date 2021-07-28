import { createContext } from 'react'
import { ModalInternalInterface } from './types'

export const InternalContext = createContext<
  ModalInternalInterface | undefined
>(undefined)
export const ModalInterfaceContext = createContext(null)
