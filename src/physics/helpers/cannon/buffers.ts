import {Buffers} from "../planckjs/types";

export const generateBuffers = (maxNumberOfPhysicsObjects: number): Buffers => {
    return {
        positions: new Float32Array(maxNumberOfPhysicsObjects * 3),
        angles: new Float32Array(maxNumberOfPhysicsObjects * 4),
    };
};
