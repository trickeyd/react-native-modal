import React, { useRef, useEffect, useState } from 'react'
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Animated,
  Dimensions,
  Easing,
  ViewStyle,
  StyleProp,
} from 'react-native'
import { ModalInterfaceContext } from './modal-contexts'
import {
  AnimationType,
  AnimateStage,
  ModalInterface,
  ModalAlign,
} from './types'

const { width, height } = Dimensions.get('window')

interface Props {
  id: string
  renderModal: (modalInterface?: ModalInterface) => JSX.Element
  onBackgroundPress?: () => void
  onClose?: () => void
  backgroundFadeDuration: number
  backgroundFadeOutDelay: number
  animationTypeIn?: AnimationType
  animationTypeOut?: AnimationType
  animationTimeIn?: number
  animationTimeOut?: number
  isClosing: boolean
  onAnimationOutComplete: () => void
  contentContainerStyle?: StyleProp<ViewStyle>
  justifyModal?: ModalAlign
  alignModal?: ModalAlign
}

export const ModalLayer = ({
  id,
  renderModal,
  onBackgroundPress,
  onClose,
  backgroundFadeDuration = 100,
  backgroundFadeOutDelay = 300,
  animationTypeIn = AnimationType.FADE,
  animationTypeOut = AnimationType.FADE,
  animationTimeIn = 400,
  animationTimeOut = 400,
  contentContainerStyle,
  justifyModal = ModalAlign.CENTER,
  alignModal = ModalAlign.CENTER,
  isClosing,
  onAnimationOutComplete,
}: Props): JSX.Element => {
  const [animationStage, setAnimationStage] = useState(AnimateStage.ANIMATE_IN)

  const backgroundOpacityIn = useRef(new Animated.Value(0)).current
  const backgroundOpacityOut = useRef(new Animated.Value(1)).current
  const modalAnimationIn = useRef(
    new Animated.Value(getOutValue(animationTypeIn)),
  ).current
  const modalAnimationOut = useRef(
    new Animated.Value(getInValue(animationTypeOut)),
  ).current

  useEffect(() => {
    if (isClosing) setAnimationStage(AnimateStage.ANIMATE_OUT)
  }, [isClosing])

  useEffect(() => {
    if (animationStage === AnimateStage.ANIMATE_IN) {
      Animated.timing(modalAnimationIn, {
        toValue: getInValue(animationTypeIn),
        duration: animationTimeIn,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(
        animationTimeIn > backgroundFadeDuration
          ? () => setAnimationStage(AnimateStage.IN)
          : undefined,
      )
      Animated.timing(backgroundOpacityIn, {
        toValue: 1,
        duration: backgroundFadeDuration,
        useNativeDriver: true,
      }).start(
        backgroundFadeDuration >= animationTimeIn
          ? () => setAnimationStage(AnimateStage.IN)
          : undefined,
      )
    } else if (animationStage === AnimateStage.ANIMATE_OUT) {
      Animated.timing(modalAnimationOut, {
        toValue: getOutValue(animationTypeOut),
        duration: animationTimeOut,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => {
        if (animationTimeOut > backgroundFadeDuration + backgroundFadeOutDelay)
          setAnimationStage(AnimateStage.COMPLETE)
      })
      Animated.timing(backgroundAnimation, {
        toValue: 0,
        duration: backgroundFadeDuration,
        useNativeDriver: true,
        delay: backgroundFadeOutDelay,
      }).start(() => {
        if (backgroundFadeDuration + backgroundFadeOutDelay >= animationTimeOut)
          setAnimationStage(AnimateStage.COMPLETE)
      })
    } else if (animationStage === AnimateStage.COMPLETE) {
      onAnimationOutComplete()
    }
  }, [modalAnimationIn, backgroundOpacityIn, animationStage])

  const currentAnimation = {
    [AnimateStage.ANIMATE_IN]: animationTypeIn,
    [AnimateStage.ANIMATE_OUT]: animationTypeOut,
    [AnimateStage.COMPLETE]: animationTypeOut,
  }[animationStage]

  const currentAnimationValue = {
    [AnimateStage.ANIMATE_IN]: modalAnimationIn,
    [AnimateStage.ANIMATE_OUT]: modalAnimationOut,
    [AnimateStage.COMPLETE]: modalAnimationOut,
  }[animationStage]

  const transform = getTransformnimatedStyleValue(
    currentAnimation,
    currentAnimationValue,
  )

  const backgroundAnimation = {
    [AnimateStage.ANIMATE_IN]: backgroundOpacityIn,
    [AnimateStage.ANIMATE_OUT]: backgroundOpacityOut,
    [AnimateStage.COMPLETE]: backgroundOpacityOut,
  }[animationStage]

  const modalInterface = {
    onClose,
    animationStage,
  }

  return (
    <ModalInterfaceContext.Provider key={id} value={modalInterface}>
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.modalAndBackground,
          { justifyContent: justifyModal, alignItems: alignModal },
        ]}
      >
        <TouchableWithoutFeedback
          onPress={() => onBackgroundPress && onBackgroundPress()}
          style={styles.background}
        >
          <Animated.View
            style={[styles.background, { opacity: backgroundAnimation }]}
          />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[styles.modalContainer, transform, contentContainerStyle]}
        >
          {renderModal(modalInterface)}
        </Animated.View>
      </View>
    </ModalInterfaceContext.Provider>
  )
}

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    backgroundColor: '#00000088',
  },
  modalAndBackground: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const getOutValue = (animationType: AnimationType) => {
  switch (animationType) {
    case AnimationType.FADE:
      return 0
    case AnimationType.SLIDE_BOTTOM:
      return height
    case AnimationType.SLIDE_TOP:
      return -height
    case AnimationType.SLIDE_LEFT:
      return -width
    case AnimationType.SLIDE_RIGHT:
      return width
  }
}

const getInValue = (animationType: AnimationType) => {
  switch (animationType) {
    case AnimationType.FADE:
      return 1
    case AnimationType.SLIDE_BOTTOM:
    case AnimationType.SLIDE_TOP:
    case AnimationType.SLIDE_LEFT:
    case AnimationType.SLIDE_RIGHT:
      return 0
  }
}

const getTransformnimatedStyleValue = (
  animationType: AnimationType,
  animationValue: any,
) => {
  switch (animationType) {
    case AnimationType.FADE:
      return { opacity: animationValue }
    case AnimationType.SLIDE_BOTTOM:
    case AnimationType.SLIDE_TOP:
      return { transform: [{ translateY: animationValue }] }
    case AnimationType.SLIDE_LEFT:
    case AnimationType.SLIDE_RIGHT:
      return { transform: [{ translateX: animationValue }] }
  }
  return undefined
}
