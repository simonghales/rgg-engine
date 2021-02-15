import React, {MutableRefObject, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {BodyData, WorkerMessageData, WorkerMessageType} from "./types";
import {getNow} from "../utils/time";
import {Object3D} from "three";
import {DEFAULT_STEP_RATE} from "./config";
import { Context } from "./PhysicsConsumer.context";
import {PhysicsConsumerSyncMeshes} from "../index";

const PhysicsConsumer: React.FC<{
    worker: Worker,
    stepRate?: number,
    lerpBody: (body: BodyData, object: Object3D, stepRate: number) => void,
    updateBodyData: (bodyData: BodyData, positions: Float32Array, angles: Float32Array) => void,
}> = ({updateBodyData, worker, children, stepRate = DEFAULT_STEP_RATE, lerpBody}) => {

    const [connected, setConnected] = useState(false)
    const [bodiesData] = useState<{
        [id: string]: BodyData
    }>({})
    const localStateRef = useRef({
        lastUpdate: getNow(),
        subscriptionsIterator: 0,
    })
    const onFixedUpdateSubscriptions = useRef<{
        [key: string]: MutableRefObject<(delta: number) => void>,
    }>({})
    const onFrameCallbacks = useRef<{
        [id: string]: () => void,
    }>({})

    const lerpMesh = useCallback((body: BodyData, ref: MutableRefObject<Object3D>) => {
        if (!ref.current) return
        const object = ref.current
        lerpBody(body, object, stepRate)
    }, [])

    const onUpdate = useCallback((updateTime: number, positions: Float32Array, angles: Float32Array, bodies: undefined | string[]) => {

        Object.entries(bodiesData).forEach(([id, bodyData]) => {
            if (bodies) {
                bodyData.index = bodies.indexOf(id)
            }
            if (bodyData.index >= 0) {
                updateBodyData(bodyData, positions, angles)
                bodyData.lastUpdate = updateTime
            }
        })

        const now = updateTime
        const delta = (now - localStateRef.current.lastUpdate) / 1000
        localStateRef.current.lastUpdate = now
        Object.values(onFixedUpdateSubscriptions.current).forEach(callback => callback.current(delta))

    }, [])

    useEffect(() => {
        if (connected) return
        const interval = setInterval(() => {
            worker.postMessage({
                type: WorkerMessageType.PHYSICS_READY,
            })
        }, 200)
        return () => {
            clearInterval(interval)
        }
    }, [connected])

    useEffect(() => {

        const previousOnMessage: any = worker.onmessage

        worker.onmessage = (event: any) => {

            const message = event.data as WorkerMessageData

            switch (message.type) {
                case WorkerMessageType.PHYSICS_ACKNOWLEDGED:
                    setConnected(true)
                    break;
                case WorkerMessageType.PHYSICS_UPDATE:

                    onUpdate(message.updateTime, message.positions, message.angles, message.bodies)

                    worker.postMessage({
                        type: WorkerMessageType.PHYSICS_PROCESSED,
                        positions: message.positions,
                        angles: message.angles,
                    }, [message.positions.buffer, message.angles.buffer])
                    break;
            }

            if (previousOnMessage) {
                previousOnMessage(event)
            }

        }

    }, [])

    const {
        subscribeToOnPhysicsUpdate,
        syncBody,
    } = useMemo(() => ({
        subscribeToOnPhysicsUpdate: (callback: MutableRefObject<(delta: number) => void>) => {
            const id = localStateRef.current.subscriptionsIterator.toString()
            localStateRef.current.subscriptionsIterator += 1
            onFixedUpdateSubscriptions.current[id] = callback
            return () => {
                delete onFixedUpdateSubscriptions.current[id]
            }
        },
        syncBody: (id: string, ref: MutableRefObject<Object3D>) => {
            localStateRef.current.subscriptionsIterator += 1
            const position: [number, number] = [ref.current.position.x, ref.current.position.y]
            const angle = ref.current.rotation.z
            const body = {
                ref,
                index: -1,
                position,
                angle,
                previous: {
                    position,
                    angle,
                },
                lastUpdate: getNow(),
                lastRender: getNow(),
            }
            bodiesData[id] = body
            onFrameCallbacks.current[id] = () => lerpMesh(body, ref)
            return () => {
                delete onFrameCallbacks.current[id]
                delete bodiesData[id]
            }
        }
    }), [])

    const syncMeshes = useCallback(() => {
        Object.values(onFrameCallbacks.current).forEach(callback => callback())
    }, [])

    const sendMessage = useCallback((message: any) => {
        worker.postMessage(message)
    }, [])

    if (!connected) return null

    return (
        <Context.Provider value={{
            subscribeToOnPhysicsUpdate,
            syncBody,
            syncMeshes,
            sendMessage,
        }}>
            <PhysicsConsumerSyncMeshes useRAF/>
            {children}
        </Context.Provider>
    );
};

export default PhysicsConsumer;