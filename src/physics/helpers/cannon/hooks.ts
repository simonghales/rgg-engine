import {AddBodyDef as CannonAddBodyDef} from "./types";
import {MutableRefObject} from "react";
import {Object3D} from "three";
import {Options, useBody} from "../planckjs/hooks";

// @ts-ignore
export const addToMessage = (props: CannonAddBodyDef, options: Partial<Options>) => {
    const message: {
        [key: string]: any,
    } = {}
    if (options.listenForCollisions) {
        message.listenForCollisions = true
    }
    return message
}

export const useCannonBody = (propsFn: () => CannonAddBodyDef, options: Partial<Options> = {}): [
    MutableRefObject<Object3D>,
    string
] => {
    return useBody(propsFn, options, addToMessage)
}