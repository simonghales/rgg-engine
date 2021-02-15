import { Sphere } from "@react-three/drei"
import React, {useEffect, useRef} from "react"
import {Object3D} from "three";
import {FixtureShape, useBody, useBodyApi, useOnFixedUpdate, usePhysicsConsumerContext} from "../../src";
import {Vec2} from "planck-js";

const Game: React.FC = () => {

    const {
        syncBody
    } = usePhysicsConsumerContext()
    const sphereRef = useRef(null as unknown as Object3D)

    useEffect(() => {
        return syncBody('player', sphereRef)
    }, [])

    useBody(() => ({
        body: {
            type: 'dynamic',
            allowSleep: false,
            fixedRotation: true,
            position: Vec2(2, 2),
            linearDamping: 40,
        },
        fixtures: [{
            shape: FixtureShape.Circle,
            args: [],
            fixtureOptions: {
                density: 10,
            }
        }],
    }), {
        id: 'player',
    })

    const api = useBodyApi('player')

    useOnFixedUpdate(() => {
        api('setLinearVelocity', [Vec2(-10, 0)])
    })

    return (
        <Sphere ref={sphereRef}>
            <meshBasicMaterial color="red"/>
        </Sphere>
    )
}

export default Game