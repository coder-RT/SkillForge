/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo } from "react";

type GlobalContextType = {
    // user: any;
    //setUser: React.Dispatch<React.SetStateAction<any>>;
    //token: string | null;
    //setToken: React.Dispatch<React.SetStateAction<string | null>>;
    userRoles: string;
};

const globalContextDefault: GlobalContextType {
    userRoles: [],
}

const GlobalContext = createContext<GlobalContextType>(globalContextDefault);

export default function GlobalContextProvider({ children }: { children: React.ReactNode }) {
    const [userRoles, setUserRoles] = useState<string>("");

    const value = useMemo(
        () => ({
            userRoles,
        }),
        [userRoles]
    );

    return (
        <>
            <GlobalContext.Provider value={value}>
                {children}
            </GlobalContext.Provider>
        </>
    );
};
