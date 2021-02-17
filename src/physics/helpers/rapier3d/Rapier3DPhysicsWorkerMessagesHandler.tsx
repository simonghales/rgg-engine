import React, {useEffect, useMemo, useRef} from "react"
import {World} from "@dimforge/rapier3d-compat/rapier.js";
import {usePlanckAppContext} from "../planckjs/PlanckApp.context";
import {WorkerMessageData, WorkerMessageType} from "../../types";
import {AddBodyDef} from "./types";
import {createBody} from "./bodies";

const Rapier3DPhysicsWorkerMessagesHandler: React.FC<{
    world: World,
    worker: Worker,
}> = ({
    world,
    worker,
    }) => {

    const {
        addBody,
        bodies,
    } = usePlanckAppContext()

    const localStateRef = useRef<{
        removeCallbacks: {
            [key: string]: () => void,
        }
    }>({
        removeCallbacks: {},
    })

    const {
        handleAddBody,
        handleModifyBody,
        handleRemoveBody,
    } = useMemo(() => ({
        handleModifyBody: ({id, method, args}: {
            id: string,
            method: string,
            args: any[],
        }) => {
            const body = bodies[id]
            if (!body) {
                console.warn(`No body found matching ${id}`)
                return
            }
            (body as any)[method](...args)
        },
        handleAddBody: ({id, props, synced}: {
            id: string,
            props: AddBodyDef,
            synced: boolean,
            listenForCollisions?: boolean,
        }) => {

            const body = createBody(world, props)
            localStateRef.current.removeCallbacks[id] = addBody(id, body, synced)
        },
        handleRemoveBody: ({id}: {
            id: string
        }) => {
            if (localStateRef.current.removeCallbacks[id]) {
                localStateRef.current.removeCallbacks[id]()
            }
            const body = bodies[id]
            world.removeRigidBody(body)
        }
    }), [])

    useEffect(() => {

        const previousOnMessage: any = worker.onmessage

        worker.onmessage = (event: any) => {

            const message = event.data as WorkerMessageData

            switch (message.type) {
                case WorkerMessageType.ADD_BODY:
                    handleAddBody(message.data)
                    break;
                case WorkerMessageType.REMOVE_BODY:
                    handleRemoveBody(message.data)
                    break;
                case WorkerMessageType.MODIFY_BODY:
                    handleModifyBody(message.data)
                    break;
            }

            if (previousOnMessage) {
                previousOnMessage(event)
            }
        }

    }, [])

    return null
}

export default Rapier3DPhysicsWorkerMessagesHandler