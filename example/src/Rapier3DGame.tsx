import React from "react"
import {useRapier3DBody} from "../../src";
import {BodyStatus} from "@dimforge/rapier3d-compat";
import {Box, Sphere, Text} from "@react-three/drei";
import {Quaternion} from "cannon-es";

const Rapier3DGame: React.FC = () => {

    const [ref] = useRapier3DBody(() => ({
        body: {
            type: BodyStatus.Dynamic,
            position: [0, 100, -5],
            mass: 1,
        },
        colliders: [{
            type: 'Ball',
            args: [1],
        }]
    }))

    const [ref2] = useRapier3DBody(() => ({
        body: {
            type: BodyStatus.Dynamic,
            position: [0, 110, -5],
            mass: 1,
        },
        colliders: [{
            type: 'Ball',
            args: [1],
        }]
    }))

    const [ref3] = useRapier3DBody(() => ({
        body: {
            type: BodyStatus.Dynamic,
            position: [0, 120, -5],
            mass: 1,
        },
        colliders: [{
            type: 'Ball',
            args: [1],
        }]
    }))

    const [staticBoxRef] = useRapier3DBody(() => ({
        body: {
            type: BodyStatus.Static,
            position: [0, -5, -5],
            // quaternion: new Quaternion().setFromEuler(0, 0, 0.05).toArray(),
        },
        colliders: [{
            type: 'Cubiod',
            args: [2, 2, 2],
        }]
    }))

    const [rRef] = useRapier3DBody(() => ({
        body: {
            type: BodyStatus.Dynamic,
            position: [0, 20, -5],
        },
        colliders: [{
            type: 'Cubiod',
            args: [1, 1, 1],
        }]
    }))

    const [gRef] = useRapier3DBody(() => ({
        body: {
            type: BodyStatus.Dynamic,
            position: [0, 15, -5],
        },
        colliders: [{
            type: 'Cubiod',
            args: [1, 1, 1],
        }]
    }))

    const [boxRef] = useRapier3DBody(() => ({
        body: {
            type: BodyStatus.Dynamic,
            position: [0, 10, -5],
        },
        colliders: [{
            type: 'Cubiod',
            args: [1, 1, 1],
        }]
    }))

    return (
        <>
            <Box args={[2, 2, 2]} ref={staticBoxRef}>
                <meshBasicMaterial color="orange"/>
            </Box>
            <group ref={rRef}>
                <Text fontSize={1.5}>
                    R
                </Text>
            </group>
            <group ref={gRef}>
                <Text fontSize={1.5}>
                    G
                </Text>
            </group>
            <group ref={boxRef}>
                <Text fontSize={1.5}>
                    G
                </Text>
            </group>
            <Sphere ref={ref}>
                <meshBasicMaterial color="red"/>
            </Sphere>
            <Sphere ref={ref3}>
                <meshBasicMaterial color="red"/>
            </Sphere>
            <Sphere ref={ref2}>
                <meshBasicMaterial color="blue"/>
            </Sphere>
        </>
    )
}

export default Rapier3DGame