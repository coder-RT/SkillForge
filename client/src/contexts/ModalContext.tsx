import { type PropsWithChildren, createContext, useContext, useState } from "react";

import { type Modals } from "../types";

type Context = {
    modals: Modals[]
    open: (modal: Modals) => void
    remove: () => void
    closeAll: () => void
}

const ModalContext = createContext({} as Context);

export const ModalProvider = ({ children }: PropsWithChildren) => {
    const [modals, setModals] = useState<Modals[]>([]);

    const open = (modal: Modals) => {
        setModals((prev) => [...prev, modal]);
    };

    const remove = () => {
        setModals((prev) => prev.slice(0, -1));
    };

    const closeAll = () => {
        setModals([]);
    };

    const value = {
        modals,
        open,
        remove,
        closeAll,
    };

    return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export const useModal = () => useContext(ModalContext)
