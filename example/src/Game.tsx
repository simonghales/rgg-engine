import { Sphere } from "@react-three/drei"
import React, {useEffect, useRef} from "react"
import {Object3D} from "three";
import {usePhysicsConsumerContext} from "../../src";

const Game: React.FC = () => {

    const {
        syncBody
    } = usePhysicsConsumerContext()
    const sphereRef = useRef(null as unknown as Object3D)

    useEffect(() => {
        return syncBody('player', sphereRef)
    }, [])

    return (
        <Sphere ref={sphereRef}>
            <meshBasicMaterial color="red"/>
        </Sphere>
    )
}

export default Game