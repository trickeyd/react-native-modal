import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { InternalContext, ModalInterfaceContext } from './modal-contexts'
import { ModalConfig, ModalInterface } from './types'
import { ModalLayer } from './modal-layer'

interface Props {
  children: JSX.Element
}

export const ModalContextLayer = ({ children }: Props) => {
  const [, setState] = useState({})
  const render = () => setState({})
  const modalConfigs = useRef([]).current

  const addModal = (
    id: string,
    onModalRemoved: () => void,
    options: ModalConfig,
  ) => {
    modalConfigs.push({
      id,
      options,
      isClosing: false,
      onModalRemoved,
    })
    render()
  }

  const closeModal = (id: string) => {
    const config = modalConfigs.find((config) => config.id === id)
    config.isClosing = true
    render()
  }

  const removeModal = (id: string) => {
    const modalIndex = modalConfigs.findIndex((config) => config.id === id)
    if (modalIndex !== -1) {
      const modalConfig = modalConfigs[modalIndex]
      modalConfigs.splice(modalIndex, 1)
      modalConfig.onModalRemoved && modalConfig.onModalRemoved()
      render()
    }
  }

  const updateModal = (id: string, options: ModalConfig) => {
    const modalConfig = modalConfigs.find((config) => config.id === id)
    if (modalConfig) {
      modalConfig.options = options
      render()
    }
  }

  return (
    <InternalContext.Provider
      value={{ addModal, closeModal, removeModal, updateModal }}
    >
      {children}
      {!!modalConfigs.length && (
        <View style={StyleSheet.absoluteFill}>
          {modalConfigs.map((modalConfig, index) => (
            <ModalLayer
              key={modalConfig.id}
              id={modalConfig.id}
              renderModal={modalConfig.options.renderModal}
              onBackgroundPress={modalConfig.options?.onBackgroundPress}
              onClose={() => closeModal(modalConfig.id)}
              isClosing={modalConfig.isClosing}
              onAnimationOutComplete={() => removeModal(modalConfig.id)}
              backgroundFadeDuration={
                modalConfig.options?.backgroundFadeDuration
              }
              backgroundFadeOutDelay={
                modalConfig.options?.backgroundFadeOutDelay
              }
              contentContainerStyle={modalConfig.options?.contentContainerStyle}
              justifyModal={modalConfig.options?.justifyModal}
              alignModal={modalConfig.options?.alignModal}
              animationTypeIn={modalConfig.options?.animationTypeIn}
              animationTypeOut={modalConfig.options?.animationTypeOut}
              animationTimeIn={modalConfig.options?.animationTimeIn}
              animationTimeOut={modalConfig.options?.animationTimeOut}
            />
          ))}
        </View>
      )}
    </InternalContext.Provider>
  )
}
