import React from "react"
import {usePlanckBody, useRapier3DBody} from "../../src";
import {BodyStatus} from "@dimforge/rapier3d-compat";
import {Box, Plane, Sphere, Text} from "@react-three/drei";
import {Euler, Quaternion} from "three";

const Rapier3DGame: React.FC = () => {

    usePlanckBody(() => ({
        body: {
            type: "static",
        },
        fixtures: [],
    }))

    return null

    // const [ref] = useRapier3DBody(() => ({
    //     body: {
    //         type: BodyStatus.Dynamic,
    //         position: [0, 100, -5],
    //         mass: 1,
    //     },
    //     colliders: [{
    //         type: 'Ball',
    //         args: [1],
    //     }]
    // }))
    //
    // const [ref2] = useRapier3DBody(() => ({
    //     body: {
    //         type: BodyStatus.Dynamic,
    //         position: [0, 110, -5],
    //         mass: 1,
    //     },
    //     colliders: [{
    //         type: 'Ball',
    //         args: [1],
    //     }]
    // }))
    //
    // const [ref3] = useRapier3DBody(() => ({
    //     body: {
    //         type: BodyStatus.Dynamic,
    //         position: [0, 120, -5],
    //         mass: 1,
    //     },
    //     colliders: [{
    //         type: 'Ball',
    //         args: [1],
    //     }]
    // }))
    //
    // const [staticBoxRef] = useRapier3DBody(() => ({
    //     body: {
    //         type: BodyStatus.Static,
    //         position: [0, -5, -5],
    //         // quaternion: new Quaternion().setFromEuler(Math.PI / 4, Math.PI / 4, Math.PI / 4).toArray(),
    //     },
    //     colliders: [{
    //         type: 'Cubiod',
    //         args: [2, 2, 2],
    //     }]
    // }))
    //
    // const [rRef] = useRapier3DBody(() => ({
    //     body: {
    //         type: BodyStatus.Dynamic,
    //         position: [0, 20, -5],
    //     },
    //     colliders: [{
    //         type: 'Cubiod',
    //         args: [1, 1, 1],
    //     }]
    // }))
    //
    // const [gRef] = useRapier3DBody(() => ({
    //     body: {
    //         type: BodyStatus.Dynamic,
    //         position: [0, 15, -5],
    //     },
    //     colliders: [{
    //         type: 'Cubiod',
    //         args: [1, 1, 1],
    //     }]
    // }))
    //
    // const [boxRef] = useRapier3DBody(() => ({
    //     body: {
    //         type: BodyStatus.Dynamic,
    //         position: [0, 10, -5],
    //     },
    //     colliders: [{
    //         type: 'Cubiod',
    //         args: [1, 1, 1],
    //     }]
    // }))
    //
    // const [testRef] = useRapier3DBody(() => ({
    //     body: {
    //         type: BodyStatus.Static,
    //         position: [0, -5, -5],
    //         quaternion: new Quaternion().setFromEuler(new Euler(Math.PI / 4, Math.PI / 4, Math.PI / 4)).toArray() as [number, number, number, number],
    //     },
    //     colliders: [{
    //         type: 'Cubiod',
    //         args: [2, 2, 2],
    //     }]
    // }))
    //
    // return (
    //     <>
    //         <Box args={[2, 2, 2]} ref={testRef}>
    //             <meshBasicMaterial color="orange" />
    //         </Box>
    //         <Box args={[2, 2, 2]} ref={staticBoxRef}>
    //             <meshBasicMaterial color="orange"/>
    //         </Box>
    //         <group ref={rRef}>
    //             {/*<Text fontSize={1.5}>*/}
    //             {/*    R*/}
    //             {/*</Text>*/}
    //             <Box/>
    //         </group>
    //         <group ref={gRef}>
    //             {/*<Text fontSize={1.5}>*/}
    //             {/*    G*/}
    //             {/*</Text>*/}
    //             <Box/>
    //         </group>
    //         <group ref={boxRef}>
    //             {/*<Text fontSize={1.5}>*/}
    //             {/*    G*/}
    //             {/*</Text>*/}
    //             <Box/>
    //         </group>
    //         <Sphere ref={ref}>
    //             <meshBasicMaterial color="red"/>
    //         </Sphere>
    //         <Sphere ref={ref3}>
    //             <meshBasicMaterial color="red"/>
    //         </Sphere>
    //         <Sphere ref={ref2}>
    //             <meshBasicMaterial color="blue"/>
    //         </Sphere>
    //     </>
    // )
}

export default Rapier3DGame