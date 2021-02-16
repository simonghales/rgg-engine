import {BodyOptions} from "objects/Body";

export type AddBodyDef = {
    body: Partial<BodyOptions>,
    shapes: {
        type: 'Sphere' | 'Box',
        args?: any[],
    }[],
    userData?: {
        [key: string]: any,
    }
}