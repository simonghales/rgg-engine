import {AddBodyDef, ExtBuffers} from "./types";
import {Body} from "planck-js";
// import {getNow} from "../../../utils/time";
import {lerp} from "../../../utils/numbers";
import {Object3D} from "three";
import {BodyData} from "../../types";

export type ApplyBufferDataFn = (
    buffers: ExtBuffers,
    syncedBodies: {
        [key: string]: any,
    },
    syncedBodiesOrder: string[]
) => void

export const lerpBody = (body: BodyData, object: Object3D, /* stepRate: number */) => {

    // const maxLerp: number = 1;

    const {
        position,
        angle,
        // lastUpdate,
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

    // const now = getNow()

    // const step = stepRate + 2
    // const nextExpectedUpdate = lastUpdate + step

    // const timeRemaining = nextExpectedUpdate - now
    // let physicsRemainingRatio = timeRemaining / step

    // if (physicsRemainingRatio < 0) {
    //     physicsRemainingRatio = 0
    // }

    // physicsRemainingRatio = 1 - physicsRemainingRatio
    // const scalar = 1 / maxLerp
    // physicsRemainingRatio *= scalar

    object.position.x = lerp(
        object.position.x,
        position[0],
        0.5,
    );

    object.position.z = lerp(
        object.position.z,
        position[1],
        0.5,
    );

    if (applyRotation) {
        object.rotation.y = angle as number; // todo - lerp
    }
}

const getPositionAndAngle = (
    buffers: ExtBuffers,
    index: number
): {
    position: [number, number];
    angle: number;
    velocity: [number, number];
} | null => {
    if (index !== undefined && buffers.positions.length && buffers.angles.length) {
        const start = index * 2;
        const position = (buffers.positions.slice(start, start + 2) as unknown) as [
            number,
            number,
        ];
        const velocityStart = index * 2;
        const velocity = (buffers.velocities.slice(velocityStart, velocityStart + 2) as unknown) as [
            number,
            number,
        ];
        return {
            position,
            angle: buffers.angles[index],
            velocity,
        };
    } else {
        return null;
    }
};

export const updateBodyData = (bodyData: BodyData, positions: Float32Array, angles: Float32Array, velocities: Float32Array ) => {
    bodyData.previous.position = bodyData.position
    bodyData.previous.angle = bodyData.angle
    const update = getPositionAndAngle({
        positions,
        angles,
        velocities,
    }, bodyData.index)
    if (update) {
        bodyData.position = update.position
        bodyData.angle = update.angle
        bodyData.velocity = update.velocity
    }
}

export const applyBufferData = (
    buffers: ExtBuffers,
    syncedBodies: {
        [key: string]: Body,
    }, syncedBodiesOrder: string[]) => {

    const {
        positions,
        angles,
        velocities,
    } = buffers

    syncedBodiesOrder.forEach((id, index) => {
        const body = syncedBodies[id]
        if (!body) return;
        const position = body.getPosition();
        const angle = body.getAngle();
        const velocity = body.getLinearVelocity();
        positions[2 * index + 0] = position.x;
        positions[2 * index + 1] = position.y;
        angles[index] = angle;
        velocities[2 * index] = velocity.x;
        velocities[2 * index + 1] = velocity.y;
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