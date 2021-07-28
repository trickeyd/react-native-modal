import React, { useState, useEffect } from 'react'
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { InternalContext, ModalInterfaceContext } from './modal-contexts'
import { ModalOptions } from './types'
import { ModalLayer } from './modal-layer'

interface Props {
  children: JSX.Element
}

export const ModalContextLayer = ({ children }: Props) => {
  const [modalConfigs, setModalConfigs] = useState([])

  const addModal = (
    renderModal: () => JSX.Element,
    id: string,
    options?: ModalOptions,
  ) => {
    setModalConfigs([
      ...modalConfigs,
      {
        renderModal,
        id,
        options,
        isClosing: false,
      },
    ])
  }

  const closeModal = (id: string) => {
    setModalConfigs(
      modalConfigs.map((config) =>
        config.id === id ? { ...config, isClosing: true } : config,
      ),
    )
  }

  const removeModal = (id: string) => {
    const modalIndex = modalConfigs.findIndex((config) => config.id === id)
    if (modalIndex !== -1) {
      modalConfigs.splice(modalIndex, 1)
      setModalConfigs([...modalConfigs])
    }
  }

  return (
    <InternalContext.Provider
      value={{
        addModal,
        closeModal,
      }}
    >
      {children}
      {!!modalConfigs.length && (
        <View style={StyleSheet.absoluteFill}>
          {modalConfigs.map((modalConfig, index) => (
            <ModalLayer
              key={modalConfig.id}
              id={modalConfig.id}
              renderModal={modalConfig.renderModal}
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
