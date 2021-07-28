"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useModalsSwitch = void 0;
const react_1 = require("react");
const use_modal_1 = require("./use-modal");
const useModalsSwitch = (modalConfigArray) => {
    const numModals = react_1.useRef(modalConfigArray.length).current;
    if (numModals !== modalConfigArray.length) {
        throw new Error('Length of modalConfigArray in useModalsSwitch has changed');
    }
    for (let i = 0, visibalIsFound = false; i < numModals; i++) {
        const modalConfig = modalConfigArray[i];
        const renderModal = modalConfig[0];
        const isVisible = visibalIsFound ? false : modalConfig[1];
        use_modal_1.useModal(renderModal, isVisible, modalConfig[2]);
        visibalIsFound = isVisible;
    }
};
exports.useModalsSwitch = useModalsSwitch;
