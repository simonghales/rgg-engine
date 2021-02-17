import {Buffers} from "../planckjs/types";
import {RigidBody} from "@dimforge/rapier3d-compat/rapier.js";
import {Object3D} from "three";
import { AddBodyDef } from "./types";

export const applyBufferData = (
    buffers: Buffers,
    syncedBodies: {
        [key: string]: RigidBody,
    }, syncedBodiesOrder: string[]) => {

    const {
        positions,
        angles,
    } = buffers

    syncedBodiesOrder.forEach((id, index) => {
        const body = syncedBodies[id]
        if (!body) return;
        const position = body.translation();
        const quaternion = body.rotation();
        positions[3 * index + 0] = position.x
        positions[3 * index + 1] = position.y
        positions[3 * index + 2] = position.z
        angles[4 * index + 0] = quaternion.x
        angles[4 * index + 1] = quaternion.y
        angles[4 * index + 2] = quaternion.z
        angles[4 * index + 3] = quaternion.w
    })

}

export const prepareObject = (object: Object3D, props: AddBodyDef) => {
    if (props.body.position) {
        object.position.set(...props.body.position as [number, number, number])
    }
    if (props.body.quaternion) {
        object.quaternion.set(...props.body.quaternion as [number, number, number, number])
    }
}