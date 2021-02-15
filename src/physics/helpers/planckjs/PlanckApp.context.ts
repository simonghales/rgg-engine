import {createContext} from "react";
import {Body, World} from "planck-js";

export type State = {
    world: World,
    addSyncedBody: (uid: string, body: Body) => void,
    removeSyncedBody: (uid: string) => void,
}

export const Context = createContext(null as unknown as State)