"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalLayer = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const modal_contexts_1 = require("./modal-contexts");
const types_1 = require("./types");
const { width, height } = react_native_1.Dimensions.get('window');
const ModalLayer = ({ id, renderModal, onBackgroundPress, onClose, backgroundFadeDuration = 100, backgroundFadeOutDelay = 300, animationTypeIn = types_1.AnimationType.FADE, animationTypeOut = types_1.AnimationType.FADE, animationTimeIn = 400, animationTimeOut = 400, isClosing, onAnimationOutComplete, }) => {
    const [animationStage, setAnimationStage] = react_1.useState(types_1.AnimateStage.ANIMATE_IN);
    const backgroundOpacityIn = react_1.useRef(new react_native_1.Animated.Value(0)).current;
    const backgroundOpacityOut = react_1.useRef(new react_native_1.Animated.Value(1)).current;
    const modalAnimationIn = react_1.useRef(new react_native_1.Animated.Value(getOutValue(animationTypeIn))).current;
    const modalAnimationOut = react_1.useRef(new react_native_1.Animated.Value(getInValue(animationTypeOut))).current;
    react_1.useEffect(() => {
        if (isClosing)
            setAnimationStage(types_1.AnimateStage.ANIMATE_OUT);
    }, [isClosing]);
    react_1.useEffect(() => {
        if (animationStage === types_1.AnimateStage.ANIMATE_IN) {
            react_native_1.Animated.timing(modalAnimationIn, {
                toValue: getInValue(animationTypeIn),
                duration: animationTimeIn,
                easing: react_native_1.Easing.ease,
                useNativeDriver: true,
            }).start(animationTimeIn > backgroundFadeDuration
                ? () => setAnimationStage(types_1.AnimateStage.IN)
                : undefined);
            react_native_1.Animated.timing(backgroundOpacityIn, {
                toValue: 1,
                duration: backgroundFadeDuration,
                useNativeDriver: true,
            }).start(backgroundFadeDuration >= animationTimeIn
                ? () => setAnimationStage(types_1.AnimateStage.IN)
                : undefined);
        }
        else if (animationStage === types_1.AnimateStage.ANIMATE_OUT) {
            react_native_1.Animated.timing(modalAnimationOut, {
                toValue: getOutValue(animationTypeOut),
                duration: animationTimeOut,
                easing: react_native_1.Easing.ease,
                useNativeDriver: true,
            }).start(animationTimeOut > backgroundFadeDuration + backgroundFadeOutDelay
                ? onAnimationOutComplete
                : undefined);
            react_native_1.Animated.timing(backgroundAnimation, {
                toValue: 0,
                duration: backgroundFadeDuration,
                useNativeDriver: true,
                delay: backgroundFadeOutDelay,
            }).start(backgroundFadeDuration + backgroundFadeOutDelay >= animationTimeOut
                ? onAnimationOutComplete
                : undefined);
        }
    }, [modalAnimationIn, backgroundOpacityIn, animationStage]);
    const currentAnimation = {
        [types_1.AnimateStage.ANIMATE_IN]: animationTypeIn,
        [types_1.AnimateStage.ANIMATE_OUT]: animationTypeOut,
    }[animationStage];
    const currentAnimationValue = {
        [types_1.AnimateStage.ANIMATE_IN]: modalAnimationIn,
        [types_1.AnimateStage.ANIMATE_OUT]: modalAnimationOut,
    }[animationStage];
    const transform = getTransformnimatedStyleValue(currentAnimation, currentAnimationValue);
    const backgroundAnimation = {
        [types_1.AnimateStage.ANIMATE_IN]: backgroundOpacityIn,
        [types_1.AnimateStage.ANIMATE_OUT]: backgroundOpacityOut,
    }[animationStage];
    return (<modal_contexts_1.ModalInterfaceContext.Provider key={id} value={{ onClose, animationStage }}>
      <react_native_1.View style={[react_native_1.StyleSheet.absoluteFill, styles.modalAndBackground]}>
        <react_native_1.TouchableWithoutFeedback onPress={() => onBackgroundPress && onBackgroundPress()} style={styles.background}>
          <react_native_1.Animated.View style={[styles.background, { opacity: backgroundAnimation }]}/>
        </react_native_1.TouchableWithoutFeedback>
        <react_native_1.Animated.View style={[styles.modalContainer, transform]}>
          {renderModal(animationStage)}
        </react_native_1.Animated.View>
      </react_native_1.View>
    </modal_contexts_1.ModalInterfaceContext.Provider>);
};
exports.ModalLayer = ModalLayer;
const styles = react_native_1.StyleSheet.create({
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
});
const getOutValue = (animationType) => {
    switch (animationType) {
        case types_1.AnimationType.FADE:
            return 0;
        case types_1.AnimationType.SLIDE_BOTTOM:
            return height;
        case types_1.AnimationType.SLIDE_TOP:
            return -height;
        case types_1.AnimationType.SLIDE_LEFT:
            return -width;
        case types_1.AnimationType.SLIDE_RIGHT:
            return width;
    }
};
const getInValue = (animationType) => {
    switch (animationType) {
        case types_1.AnimationType.FADE:
            return 1;
        case types_1.AnimationType.SLIDE_BOTTOM:
        case types_1.AnimationType.SLIDE_TOP:
        case types_1.AnimationType.SLIDE_LEFT:
        case types_1.AnimationType.SLIDE_RIGHT:
            return 0;
    }
};
const getTransformnimatedStyleValue = (animationType, animationValue) => {
    switch (animationType) {
        case types_1.AnimationType.FADE:
            return { opacity: animationValue };
        case types_1.AnimationType.SLIDE_BOTTOM:
        case types_1.AnimationType.SLIDE_TOP:
            return { transform: [{ translateY: animationValue }] };
        case types_1.AnimationType.SLIDE_LEFT:
        case types_1.AnimationType.SLIDE_RIGHT:
            return { transform: [{ translateX: animationValue }] };
    }
    return undefined;
};
