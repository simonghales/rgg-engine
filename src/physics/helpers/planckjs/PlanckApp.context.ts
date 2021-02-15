import {createContext, useContext} from "react";
import {Body, World} from "planck-js";

export type State = {
    world: World,
    addSyncedBody: (uid: string, body: Body) => void,
    removeSyncedBody: (uid: string) => void,
    addBody: (id: string, body: Body, synced?: boolean) => void,
    bodies: {
        [key: string]: Body,
    },
}

export const Context = createContext(null as unknown as State)

export const usePlanckAppContext = () => useContext(Context)