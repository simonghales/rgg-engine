import {ExtBuffers} from "./types";

export const generateBuffers = (maxNumberOfPhysicsObjects: number): ExtBuffers => {
    return {
        positions: new Float32Array(maxNumberOfPhysicsObjects * 2),
        angles: new Float32Array(maxNumberOfPhysicsObjects),
        velocities: new Float32Array(maxNumberOfPhysicsObjects * 2),
    };
};
