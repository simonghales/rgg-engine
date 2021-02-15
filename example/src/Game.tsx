import { Sphere } from "@react-three/drei"
import React, {useEffect, useRef} from "react"
import {Object3D} from "three";
import {FixtureShape, useBody, useBodyApi, useOnFixedUpdate, usePhysicsConsumerContext} from "../../src";
import {Vec2} from "planck-js";
import { Vec3 } from "cannon-es";

const Game: React.FC = () => {

    const {
        syncBody
    } = usePhysicsConsumerContext()
    const sphereRef = useRef(null as unknown as Object3D)

    useEffect(() => {
        return syncBody('player', sphereRef)
    }, [])

    // useBody(() => ({
    //     body: {
    //         type: 'dynamic',
    //         allowSleep: false,
    //         fixedRotation: true,
    //         position: Vec2(2, 2),
    //         linearDamping: 40,
    //     },
    //     fixtures: [{
    //         shape: FixtureShape.Circle,
    //         args: [],
    //         fixtureOptions: {
    //             density: 10,
    //         }
    //     }],
    // }), {
    //     id: 'player',
    // })

    useBody(() => ({
        body: {
            mass: 1,
            position: new Vec3(0, 5, -5)
        },
        shapes: [{
            type: 'Sphere',
            args: [1],
        }],
    }), {
        id: 'player',
    })

    const api = useBodyApi('player')

    useOnFixedUpdate((delta) => {
        // api('applyForce', [new Vec3(-0.25, -0.25, 0.25)])
    })

    return (
        <Sphere ref={sphereRef}>
            <meshBasicMaterial color="red"/>
        </Sphere>
    )
}

export default Game