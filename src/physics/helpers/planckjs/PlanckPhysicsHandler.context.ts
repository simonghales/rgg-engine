import {createContext, useContext} from "react";
import {Body} from "planck-js";

type State = {
    getPendingSyncedBodiesIteration: () => number,
    syncedBodies: {
        [key: string]: Body,
    }
    syncedBodiesOrder: string[],
    maxNumberOfSyncedBodies: number,
}

export const Context = createContext(null as unknown as State)

export const usePlanckPhysicsHandlerContext = () => useContext(Context)