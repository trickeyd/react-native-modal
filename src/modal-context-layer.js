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
exports.ModalContextLayer = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const modal_contexts_1 = require("./modal-contexts");
const modal_layer_1 = require("./modal-layer");
const ModalContextLayer = ({ children }) => {
    const [modalConfigs, setModalConfigs] = react_1.useState([]);
    const addModal = (renderModal, id, options) => {
        setModalConfigs([
            ...modalConfigs,
            {
                renderModal,
                id,
                options,
                isClosing: false,
            },
        ]);
    };
    const closeModal = (id) => {
        setModalConfigs(modalConfigs.map((config) => config.id === id ? { ...config, isClosing: true } : config));
    };
    const removeModal = (id) => {
        const modalIndex = modalConfigs.findIndex((config) => config.id === id);
        if (modalIndex !== -1) {
            modalConfigs.splice(modalIndex, 1);
            setModalConfigs([...modalConfigs]);
        }
    };
    return (<modal_contexts_1.InternalContext.Provider value={{
        addModal,
        closeModal,
    }}>
      {children}
      {!!modalConfigs.length && (<react_native_1.View style={react_native_1.StyleSheet.absoluteFill}>
          {modalConfigs.map((modalConfig, index) => (<modal_layer_1.ModalLayer key={modalConfig.id} id={modalConfig.id} renderModal={modalConfig.renderModal} onBackgroundPress={modalConfig.options?.onBackgroundPress} onClose={() => closeModal(modalConfig.id)} isClosing={modalConfig.isClosing} onAnimationOutComplete={() => removeModal(modalConfig.id)} backgroundFadeDuration={modalConfig.options?.backgroundFadeDuration} backgroundFadeOutDelay={modalConfig.options?.backgroundFadeOutDelay} animationTypeIn={modalConfig.options?.animationTypeIn} animationTypeOut={modalConfig.options?.animationTypeOut} animationTimeIn={modalConfig.options?.animationTimeIn} animationTimeOut={modalConfig.options?.animationTimeOut}/>))}
        </react_native_1.View>)}
    </modal_contexts_1.InternalContext.Provider>);
};
exports.ModalContextLayer = ModalContextLayer;
