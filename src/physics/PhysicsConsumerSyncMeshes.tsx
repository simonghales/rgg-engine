import React, {useEffect} from "react"
import {useFrame} from "react-three-fiber";
import {usePhysicsConsumerContext} from "./PhysicsConsumer.context";

const RAFSync: React.FC = () => {

    const {syncMeshes} = usePhysicsConsumerContext()
    useFrame(syncMeshes)

    return null
}

const IntervalSync: React.FC = () => {

    const {syncMeshes} = usePhysicsConsumerContext()

    useEffect(() => {
        const interval = setInterval(() => {
            syncMeshes()
        }, 1000 / 30)
        return () => {
            clearInterval(interval)
        }
    }, [])

    return null
}

const PhysicsConsumerSyncMeshes: React.FC<{
    useRAF?: boolean
}> = ({
    useRAF = false,
}) => {
    if (useRAF) return <RAFSync/>
    return <IntervalSync/>
}

export default PhysicsConsumerSyncMeshes