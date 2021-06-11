import React, {
    createContext,
    MutableRefObject,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import {BodyData, WorkerMessageData, WorkerMessageType} from "./types";
import {getNow} from "../utils/time";
import {Object3D} from "three";
// import {DEFAULT_STEP_RATE} from "./config";
import {Context} from "./PhysicsConsumer.context";
import {PhysicsConsumerSyncMeshes} from "../index";
import {WorkerMessaging} from "../generic";
import {useTransferKeyEvents} from "../keys";

export type DefaultPhysicsConsumerProps = {
    worker: Worker,
    stepRate?: number,
    paused?: boolean,
}

const FixedUpdateContext = createContext<{
    onFixedUpdateSubscriptions: MutableRefObject<{
        [key: string]: MutableRefObject<(delta: number) => void>,
    }>,
    subscribeToOnPhysicsUpdate: (callback: MutableRefObject<(delta: number) => void>) => () => void,
    updateSubscriptions: (delta: number) => void,
}>(null!)

export const useFixedUpdateContext = () =>{
    return useContext(FixedUpdateContext)
}

export const OnFixedUpdateProvider: React.FC = ({children}) => {

    const localStateRef = useRef<{
        subscriptionsIterator: number,
    }>({
        subscriptionsIterator: 0,
    })

    const onFixedUpdateSubscriptions = useRef<{
        [key: string]: MutableRefObject<(delta: number) => void>,
    }>({})

    const {
        subscribeToOnPhysicsUpdate,
        updateSubscriptions,
    } = useMemo(() => ({
        subscribeToOnPhysicsUpdate: (callback: MutableRefObject<(delta: number) => void>) => {
            const id = localStateRef.current.subscriptionsIterator.toString()
            localStateRef.current.subscriptionsIterator += 1
            onFixedUpdateSubscriptions.current[id] = callback
            return () => {
                delete onFixedUpdateSubscriptions.current[id]
            }
        },
        updateSubscriptions: (delta: number) => {
            Object.values(onFixedUpdateSubscriptions.current).forEach(callback => callback.current(delta))
        }
    }), [])

    return (
        <FixedUpdateContext.Provider value={{
            onFixedUpdateSubscriptions,
            subscribeToOnPhysicsUpdate,
            updateSubscriptions,
        }}>
            {children}
        </FixedUpdateContext.Provider>
    )
}

type Props = DefaultPhysicsConsumerProps & {
    lerpBody: (body: BodyData, object: Object3D) => void,
    updateBodyData: (bodyData: BodyData, positions: Float32Array, angles: Float32Array, velocities?: Float32Array) => void,
}

const PhysicsConsumer: React.FC<Props> = ({
        paused = false,
        updateBodyData,
        worker,
        children,
        // stepRate = DEFAULT_STEP_RATE,
        lerpBody
    }) => {

    const [connected, setConnected] = useState(false)
    const [bodiesData] = useState<{
        [id: string]: BodyData
    }>({})
    const localStateRef = useRef<{
        lastUpdate: number,
        subscriptionsIterator: number,
        bodies: string[],
    }>({
        lastUpdate: getNow(),
        subscriptionsIterator: 0,
        bodies: []
    })

    const {
        updateSubscriptions,
    } = useFixedUpdateContext()

    const onFrameCallbacks = useRef<{
        [id: string]: () => void,
    }>({})

    const lerpMesh = useCallback((body: BodyData, ref: MutableRefObject<Object3D>) => {
        if (!ref.current) return
        const object = ref.current
        lerpBody(body, object)
    }, [])

    const onUpdate = useCallback((_updateTime: number, positions: Float32Array, angles: Float32Array, bodies: undefined | string[], velocities?: Float32Array) => {

        const now = getNow()

        if (bodies) {
            localStateRef.current.bodies = bodies
        }

        Object.entries(bodiesData).forEach(([id, bodyData]) => {
            if (bodies) {
                bodyData.index = bodies.indexOf(id)
            }
            if (bodyData.index >= 0) {
                updateBodyData(bodyData, positions, angles, velocities);
                bodyData.lastUpdate = now
                // console.log('lastUpdate', updateTime, getNow())
            }
        })

        // const now = updateTime
        const delta = (now - localStateRef.current.lastUpdate) / 1000
        localStateRef.current.lastUpdate = now
        updateSubscriptions(delta)

    }, [updateSubscriptions])

    useEffect(() => {
        if (connected) return
        const interval = setInterval(() => {
            worker.postMessage({
                type: WorkerMessageType.PHYSICS_READY,
                paused,
            })
        }, 200)
        return () => {
            clearInterval(interval)
        }
    }, [connected, paused])

    useEffect(() => {
        worker.postMessage({
            type: WorkerMessageType.PHYSICS_SET_PAUSED,
            paused,
        })
    }, [paused])

    useEffect(() => {

        const previousOnMessage: any = worker.onmessage

        worker.onmessage = (event: any) => {

            const message = event.data as WorkerMessageData

            switch (message.type) {
                case WorkerMessageType.PHYSICS_ACKNOWLEDGED:
                    setConnected(true)
                    break;
                case WorkerMessageType.PHYSICS_UPDATE:
                    onUpdate(message.updateTime, message.positions, message.angles, message.bodies, message.velocities)

                    worker.postMessage({
                        type: WorkerMessageType.PHYSICS_PROCESSED,
                        positions: message.positions,
                        angles: message.angles,
                        velocities: message.velocities,
                        
                    }, [message.positions.buffer, message.angles.buffer, message.velocities.buffer])
                    break;
            }

            if (previousOnMessage) {
                previousOnMessage(event)
            }

        }

    }, [])

    const {
        syncBody,
    } = useMemo(() => ({
        syncBody: (id: string, ref: MutableRefObject<Object3D>, applyRotation: boolean = true) => {
            localStateRef.current.subscriptionsIterator += 1
            const body: BodyData = {
                ref,
                index: localStateRef.current.bodies.indexOf(id),
                lastUpdate: getNow(),
                lastRender: getNow(),
                previous: {},
                applyRotation,
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

    useTransferKeyEvents(worker)

    if (!connected) return null

    return (
        <WorkerMessaging worker={worker}>
            <Context.Provider value={{
                syncBody,
                syncMeshes,
                sendMessage,
                bodiesData,
            }}>
                <PhysicsConsumerSyncMeshes useRAF/>
                {children}
            </Context.Provider>
        </WorkerMessaging>
    );
};

const Wrapper: React.FC<Props> = (props) => {
    return (
        <OnFixedUpdateProvider>
            <PhysicsConsumer {...props}/>
        </OnFixedUpdateProvider>
    )
}

export default Wrapper;