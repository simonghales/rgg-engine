import {Body, Box, World, Sphere, Vec3} from "cannon-es";
import {AddBodyDef} from "./types";

export const createBody = (world: World, bodyDef: AddBodyDef) => {

    const body = new Body(bodyDef.body);

    bodyDef.shapes.forEach(({type, args}) => {
        switch (type) {
            case 'Box':
                // @ts-ignore
                const box = new Box(new Vec3(...args.map((v) => v / 2)))
                body.addShape(box as unknown as any)
                break;
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