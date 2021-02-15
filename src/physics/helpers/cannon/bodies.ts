import {Body, World, Sphere} from "cannon-es";
import {AddBodyDef} from "./types";

export const createBody = (world: World, bodyDef: AddBodyDef) => {

    const body = new Body(bodyDef.body);
    bodyDef.shapes.forEach(({type, args}) => {
        switch (type) {
            case 'Sphere':
                // @ts-ignore
                const sphere = new Sphere(...args)
                body.addShape(sphere as unknown as any)
                break;
            default:
                break;
        }
    })
    world.addBody(body);
    return body;

}