import {createContext, MutableRefObject, useContext} from "react";
import {Object3D} from "three";
import {BodyData} from './types';

type State = {
    syncBody: (id: string, ref: MutableRefObject<Object3D>, applyRotation?: boolean) => () => void,
    syncMeshes: (_: any, delta: number) => void,
    sendMessage: (message: any) => void,
    bodiesData: { [id: string]: BodyData },
}

export const Context = createContext(null as unknown as State)

export const usePhysicsConsumerContext = () => useContext(Context)