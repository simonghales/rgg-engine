import React, {useEffect, useMemo} from "react"
import {WorkerMessageData, WorkerMessageType} from "../../types";
import {AddBodyDef} from "./types";
import {createBody} from "./bodies";
import {World} from "planck-js";
import {usePlanckAppContext} from "./PlanckApp.context";

const PlanckPhysicsWorkerMessagesHandler: React.FC<{
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
        }) => {

            const body = createBody(world, props.body, props.fixtures)
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

export default PlanckPhysicsWorkerMessagesHandler