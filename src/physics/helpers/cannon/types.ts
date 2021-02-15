import {BodyOptions} from "objects/Body";

export type AddBodyDef = {
    body: Partial<BodyOptions>,
    shapes: {
        type: 'Sphere',
        args?: any[],
    }[],
}