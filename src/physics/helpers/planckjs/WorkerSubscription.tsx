import React, {useCallback, useEffect, useRef, useState} from "react";
import {usePlanckPhysicsHandlerContext} from "./PlanckPhysicsHandler.context";
import {getNow} from "../../../utils/time";
import {WorkerMessageData, WorkerMessageType} from "../../types";
import {ApplyBufferDataFn} from "./updates";
import {Buffers} from "./types";

const WorkerSubscription: React.FC<{
    worker: Worker,
    subscribe: (callback: () => void) => () => void,
    applyBufferData: ApplyBufferDataFn,
    generateBuffers: (maxNumberOfSyncedBodies: number) => Buffers,
    setPaused?: (paused: boolean) => void,
}> = ({worker, subscribe, applyBufferData, generateBuffers, setPaused}) => {

    const {
        getPendingSyncedBodiesIteration,
        syncedBodies,
        syncedBodiesOrder,
        maxNumberOfSyncedBodies,
    } = usePlanckPhysicsHandlerContext()

    const [buffers] = useState(() => generateBuffers(maxNumberOfSyncedBodies))
    const localStateRef = useRef({
        lastUpdate: -1,
        bodiesIteration: -1,
    })
    const [buffersAvailable, setBuffersAvailable] = useState(false)
    const [updateCount, setUpdateCount] = useState(0)

    const updateWorker = useCallback((update: number) => {
        localStateRef.current.lastUpdate = update
        setBuffersAvailable(false)

        const bodiesIteration = getPendingSyncedBodiesIteration()
        const shouldSyncBodies = bodiesIteration !== localStateRef.current.bodiesIteration

        applyBufferData(buffers, syncedBodies, syncedBodiesOrder)

        const {
            positions,
            angles,
        } = buffers

        const message: any = {
            type: WorkerMessageType.PHYSICS_UPDATE,
            updateTime: getNow(),
            positions: positions,
            angles: angles,
        }

        if (shouldSyncBodies) {
            message.bodies = syncedBodiesOrder
            localStateRef.current.bodiesIteration = bodiesIteration
        }

        worker.postMessage(message, [positions.buffer, angles.buffer])

        // process local fixed updates

    }, [getPendingSyncedBodiesIteration, syncedBodies, syncedBodiesOrder])

    const updateWorkerRef = useRef(updateWorker)

    useEffect(() => {
        updateWorkerRef.current = updateWorker
    }, [updateWorker])

    useEffect(() => {
        if (!buffersAvailable) return
        if (updateCount <= localStateRef.current.lastUpdate) return
        updateWorkerRef.current(updateCount)
    }, [updateCount, buffersAvailable])

    const onUpdate = useCallback(() => {
        setUpdateCount(state => state + 1)
    }, [])

    const onUpdateRef = useRef(onUpdate)

    useEffect(() => {
        onUpdateRef.current = onUpdate
    }, [onUpdate])

    useEffect(() => {

        return subscribe(() => onUpdateRef.current())

    }, [])

    useEffect(() => {
        const previousOnMessage: any = worker.onmessage

        worker.onmessage = (event: any) => {

            const message = event.data as WorkerMessageData

            switch (message.type) {
                case WorkerMessageType.PHYSICS_PROCESSED:
                    buffers.positions = message.positions
                    buffers.angles = message.angles
                    setBuffersAvailable(true)
                    break;
                case WorkerMessageType.PHYSICS_SET_PAUSED:
                    if (setPaused) {
                        setPaused(message.paused ?? false)
                    }
                    break;
                case WorkerMessageType.PHYSICS_READY:
                    if (setPaused) {
                        setPaused(message.paused ?? false)
                    }
                    setBuffersAvailable(true)
                    worker.postMessage({
                        type: WorkerMessageType.PHYSICS_ACKNOWLEDGED,
                    })
                    break;
            }

            if (previousOnMessage) {
                previousOnMessage(event)
            }
        }

    }, [])

    return null
}

export default WorkerSubscription;