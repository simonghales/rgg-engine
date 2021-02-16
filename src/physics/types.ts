import {MutableRefObject} from "react";
import {Object3D} from "three";

export type OnWorldStepFn = (delta: number) => void

export enum WorkerMessageType {
    PHYSICS_UPDATE,
    PHYSICS_PROCESSED,
    PHYSICS_READY,
    PHYSICS_ACKNOWLEDGED,
    ADD_BODY,
    REMOVE_BODY,
    MODIFY_BODY,
}

export type WorkerMessageData = {
    type: WorkerMessageType,
    data?: any,
    [key: string]: any,
}

export type BodyData = {
    ref: MutableRefObject<Object3D>,
    index: number,
    position?: [number, number] | [number, number, number],
    angle?: number | [number, number, number, number],
    previous: {
        position?: [number, number] | [number, number, number],
        angle?: number | [number, number, number, number],
    },
    lastUpdate: number,
    lastRender: number,
}