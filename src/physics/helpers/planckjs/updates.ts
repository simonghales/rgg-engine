import {AddBodyDef, Buffers} from "./types";
import {Body} from "planck-js";
import {getNow} from "../../../utils/time";
import {lerp} from "../../../utils/numbers";
import {Object3D} from "three";
import {BodyData} from "../../types";

export type ApplyBufferDataFn = (
    buffers: Buffers,
    syncedBodies: {
        [key: string]: any,
    },
    syncedBodiesOrder: string[]
) => void

export const lerpBody = (body: BodyData, object: Object3D, stepRate: number) => {

    const {
        position,
        angle,
        lastUpdate,
        previous,
        applyRotation = true,
    } = body

    if (!position || angle == undefined) {
        return
    }

    if (!previous.position || previous.angle == undefined) {
        object.position.x = position[0]
        object.position.z = position[1]
        if (applyRotation) {
            object.rotation.y = angle as number
        }
        return
    }

    const now = getNow()

    const step = stepRate + 2
    const nextExpectedUpdate = lastUpdate + step

    const timeRemaining = nextExpectedUpdate - now
    let physicsRemainingRatio = timeRemaining / step

    if (physicsRemainingRatio < 0) {
        physicsRemainingRatio = 0
    }

    physicsRemainingRatio = 1 - physicsRemainingRatio

    object.position.x = lerp(
        previous.position[0],
        position[0],
        physicsRemainingRatio
    );

    object.position.z = lerp(
        previous.position[1],
        position[1],
        physicsRemainingRatio
    );

    if (applyRotation) {
        object.rotation.y = angle as number; // todo - lerp
    }
}

const getPositionAndAngle = (
    buffers: Buffers,
    index: number
): {
    position: [number, number];
    angle: number;
} | null => {
    if (index !== undefined && buffers.positions.length && buffers.angles.length) {
        const start = index * 2;
        const position = (buffers.positions.slice(start, start + 2) as unknown) as [
            number,
            number
        ];
        return {
            position,
            angle: buffers.angles[index],
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
        const position = body.getPosition();
        const angle = body.getAngle();
        positions[2 * index + 0] = position.x;
        positions[2 * index + 1] = position.y;
        angles[index] = angle;
    })

}

export const prepareObject = (object: Object3D, props: AddBodyDef) => {
    if (props.body.position) {
        object.position.x = props.body.position.x
        object.position.z = props.body.position.y
    }
    if (props.body.angle) {
        object.rotation.y = props.body.angle
    }
}