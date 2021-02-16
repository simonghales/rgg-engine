import {BodyStatus} from "@dimforge/rapier3d-compat/rapier";

export type ColliderDef = {
    type: 'Cubiod' | 'Ball',
    args: any[],
    density?: number,
}

export type AddBodyDef = {
    body: {
        type: BodyStatus,
        position?: [number, number, number],
        quaternion?: [number, number, number, number],
        mass?: number,
    },
    colliders: ColliderDef[]
}