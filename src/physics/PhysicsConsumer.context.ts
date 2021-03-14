import {createContext, MutableRefObject, useContext} from "react";
import {Object3D} from "three";

type State = {
    syncBody: (id: string, ref: MutableRefObject<Object3D>) => () => void,
    syncMeshes: () => void,
    sendMessage: (message: any) => void,
}

export const Context = createContext(null as unknown as State)

export const usePhysicsConsumerContext = () => useContext(Context)