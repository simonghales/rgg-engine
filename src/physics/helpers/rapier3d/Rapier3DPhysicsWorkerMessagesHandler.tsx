import React, {useEffect, useMemo} from "react"
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

    const {
        handleAddBody,
        handleModifyBody,
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
            addBody(id, body, synced)
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