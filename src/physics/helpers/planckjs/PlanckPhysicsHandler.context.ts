import {createContext, useContext} from "react";

type State = {
    getPendingSyncedBodiesIteration: () => number,
    syncedBodies: {
        [key: string]: any,
    }
    syncedBodiesOrder: string[],
    maxNumberOfSyncedBodies: number,
}

export const Context = createContext(null as unknown as State)

export const usePlanckPhysicsHandlerContext = () => useContext(Context)