import {Options, useBody} from "../planckjs/hooks";
import {MutableRefObject} from "react";
import {Object3D} from "three";
import {addToMessage} from "../cannon/hooks";
import {AddBodyDef} from "./types";

export const useRapier3DBody = (propsFn: () => AddBodyDef, options: Partial<Options> = {}): [
    MutableRefObject<Object3D>,
    string
] => {
    return useBody(propsFn, options, addToMessage)
}