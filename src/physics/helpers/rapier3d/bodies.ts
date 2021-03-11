import {World, RigidBodyDesc, ColliderDesc, RigidBody} from "@dimforge/rapier3d-compat/rapier.js";
import {AddBodyDef, ColliderDef} from "./types";

const createColliderDesc = (colliderDef: ColliderDef): ColliderDesc | null => {
    switch (colliderDef.type) {
        case "Ball":
            // @ts-ignore
            return ColliderDesc.ball(...colliderDef.args);
        case "Cubiod":
            // @ts-ignore
            return ColliderDesc.cuboid(...colliderDef.args);
    }
    return null
}

const createCollider = (world: World, body: RigidBody, colliderDef: ColliderDef) => {
    const collider = createColliderDesc(colliderDef)
    if (!collider) return
    world.createCollider(collider, body.handle)
}

export const removeBody = (world: World, body: RigidBody) => {
    world.removeRigidBody(body)
}

export const createBody = (world: World, bodyDef: AddBodyDef) => {

    const rigidBodyDesc = new RigidBodyDesc(bodyDef.body.type);

    if (bodyDef.body.mass != undefined) {
        rigidBodyDesc.setMass(bodyDef.body.mass)
    }
    if (bodyDef.body.position) {
        rigidBodyDesc.setTranslation(...(bodyDef.body.position as [number, number, number]))
    }
    if (bodyDef.body.quaternion) {
        rigidBodyDesc.setRotation({
            x: bodyDef.body.quaternion[0],
            y: bodyDef.body.quaternion[1],
            z: bodyDef.body.quaternion[2],
            w: bodyDef.body.quaternion[3],
        })
    }
    const body = world.createRigidBody(rigidBodyDesc);

    bodyDef.colliders.forEach((collider) => {
        createCollider(world, body, collider)
    })

    return body

}