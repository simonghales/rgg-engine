import {createContext, useContext} from "react";

export type State = {
    world: any,
    addSyncedBody: (uid: string, body: any) => void,
    removeSyncedBody: (uid: string) => void,
    addBody: (id: string, body: any, synced?: boolean) => () => void,
    bodies: {
        [key: string]: any,
    },
}

export const Context = createContext(null as unknown as State)

export const usePlanckAppContext = () => useContext(Context)