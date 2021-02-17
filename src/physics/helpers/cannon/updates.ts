import {Body} from "cannon-es";
import {BodyData} from "../../types";
import {Object3D, Quaternion} from "three";
import {getNow} from "../../../utils/time";
import {lerp} from "../../../utils/numbers";
import { AddBodyDef } from "./types";
import { Buffers } from "../planckjs/types";

export const applyBufferData = (
    buffers: Buffers,
    syncedBodies: {
        [key: string]: Body,
    }, syncedBodiesOrder: string[]) => {

    const {
        positions,
        angles,
    } = buffers

    syncedBodiesOrder.forEach((id, index) => {
        const body = syncedBodies[id]
        if (!body) return;
        const position = body.position;
        const quaternion = body.quaternion;
        positions[3 * index + 0] = position.x
        positions[3 * index + 1] = position.y
        positions[3 * index + 2] = position.z
        angles[4 * index + 0] = quaternion.x
        angles[4 * index + 1] = quaternion.y
        angles[4 * index + 2] = quaternion.z
        angles[4 * index + 3] = quaternion.w
    })

}

const quat = new Quaternion()

export const lerpBody = (body: BodyData, object: Object3D, stepRate: number) => {
    const {
        position,
        angle,
        lastUpdate,
        previous,
    } = body

    if (!position || !angle) return

    if (!previous.position || !previous.angle) {
        object.position.set(...position as [number, number, number])
        object.quaternion.set(...angle as [number, number, number, number])
        return
    }

    const now = getNow()

    const nextExpectedUpdate = lastUpdate + stepRate + 1

    const min = lastUpdate
    const max = nextExpectedUpdate

    let normalised = ((now - min) / (max - min))

    normalised = normalised < 0 ? 0 : normalised > 1 ? 1 : normalised

    const physicsRemainingRatio = normalised

    object.position.x = lerp(
        previous.position[0],
        position[0],
        physicsRemainingRatio
    );

    object.position.y = lerp(
        previous.position[1],
        position[1],
        physicsRemainingRatio
    );

    object.position.z = lerp(
        previous.position[2] as number,
        position[2] as number,
        physicsRemainingRatio
    );

    object.quaternion.fromArray(previous.angle as [number, number, number, number])
    quat.fromArray(angle as [number, number, number, number])
    object.quaternion.slerp(quat, physicsRemainingRatio)
}

const getPositionAndAngle = (
    buffers: Buffers,
    index: number
): {
    position: [number, number, number];
    angle: [number, number, number, number];
} | null => {
    if (index !== undefined && buffers.positions.length && buffers.angles.length) {
        const start = index * 3;
        const position = (buffers.positions.slice(start, start + 3) as unknown) as [
            number,
            number,
            number,
        ];
        const angleStart = index * 4;
        const angle = (buffers.angles.slice(angleStart, angleStart + 4) as unknown) as [
            number,
            number,
            number,
            number,
        ];
        return {
            position,
            angle,
        };
    } else {
        return null;
    }
};

export const updateBodyData = (bodyData: BodyData, positions: Float32Array, angles: Float32Array) => {
    bodyData.previous.position = bodyData.position
    bodyData.previous.angle = bodyData.angle
    const update = getPositionAndAngle({
        positions,
        angles,
    }, bodyData.index)
    if (update) {
        bodyData.position = update.position
        bodyData.angle = update.angle
    }
}

export const prepareObject = (object: Object3D, props: AddBodyDef) => {
    if (props.body.position) {
        object.position.set(...props.body.position.toArray())
    }
    if (props.body.quaternion) {
        object.quaternion.set(...props.body.quaternion.toArray())
    }
}