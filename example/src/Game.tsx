import {Box, Sphere } from "@react-three/drei"
import React, {useEffect, useRef} from "react"
import {
    FixtureShape,
    usePlanckBody,
    useBodyApi,
    useOnFixedUpdate,
    usePhysicsConsumerContext,
    useCannonBody
} from "../../src";
import {Vec2} from "planck-js";
import { Vec3, Quaternion, Body } from "cannon-es";

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

const Game: React.FC = () => {

    const [sphereRef] = useCannonBody(() => ({
        body: {
            mass: 1,
            position: new Vec3(0, 20, -5)
        },
        shapes: [{
            type: 'Sphere',
            args: [1],
        }],
    }))

    const [sphere2Ref] = useCannonBody(() => ({
        body: {
            mass: 1,
            position: new Vec3(0, 10, -5)
        },
        shapes: [{
            type: 'Sphere',
            args: [1],
        }],
    }))

    const [staticBoxRef] = useCannonBody(() => ({
        body: {
            position: new Vec3(0, -5, -5),
            quaternion: new Quaternion().setFromEuler(0, 0, 0.05),
            type: Body.STATIC,
        },
        shapes: [{
            type: 'Box',
            args: [2, 2, 2],
        }],
    }), {
        listenForCollisions: true,
    })

    const [boxRef] = useCannonBody(() => ({
        body: {
            mass: 1,
            position: new Vec3(0, 5, -5)
        },
        shapes: [{
            type: 'Box',
            args: [1, 1, 1],
        }],
    }))

    const api = useBodyApi('player')

    useOnFixedUpdate((delta) => {
        // api('applyForce', [new Vec3(-0.25, -0.25, 0.25)])
    })

    // console.log('boxRef', boxRef, boxId)

    return (
        <>
            <Box args={[2, 2, 2]} ref={staticBoxRef}>
                <meshBasicMaterial color="orange"/>
            </Box>
            <Box args={[1, 1, 1]} ref={boxRef}>
                <meshBasicMaterial color="blue"/>
            </Box>
            <Sphere ref={sphereRef}>
                <meshBasicMaterial color="red"/>
            </Sphere>
            <Sphere ref={sphere2Ref}>
                <meshBasicMaterial color="blue"/>
            </Sphere>
        </>
    )
}

export default Game