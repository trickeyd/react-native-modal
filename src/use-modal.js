"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useModal = void 0;
const react_1 = require("react");
const uuid_1 = require("uuid");
const modal_contexts_1 = require("./modal-contexts");
const useModal = (renderModal, isVisible, options, onModalClosed) => {
    const { addModal, closeModal } = react_1.useContext(modal_contexts_1.InternalContext);
    const id = react_1.useRef(uuid_1.v4()).current;
    const isMounted = react_1.useRef(false);
    react_1.useEffect(() => {
        if (isMounted.current && !isVisible) {
            closeModal(id);
            isMounted.current = false;
            onModalClosed && onModalClosed();
        }
        else if (!isMounted.current && isVisible) {
            addModal(renderModal, id, options);
            isMounted.current = true;
        }
    }, [isVisible]);
};
exports.useModal = useModal;
