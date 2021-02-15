import {AddBodyDef} from "./types";
import {useCallback, useEffect, useRef, useState} from "react";
import {generateUUID} from "../../../utils/ids";
import {usePhysicsConsumerContext} from "../../PhysicsConsumer.context";
import {WorkerMessageType} from "../../types";
import {AddBodyDef as CannonAddBodyDef} from "../cannon/types";

export const useOnFixedUpdate = (callback: (delta: number) => void) => {
    const {
        subscribeToOnPhysicsUpdate
    } = usePhysicsConsumerContext()

    const callbackRef = useRef(callback)

    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    useEffect(() => {
        return subscribeToOnPhysicsUpdate(callbackRef)
    }, [])

}

export const useBodyApi = (id: string) => {
    const {sendMessage} = usePhysicsConsumerContext()

    return useCallback((method: string,
                        args: any[],) => {
        sendMessage({
            type: WorkerMessageType.MODIFY_BODY,
            data: {
                id,
                method,
                args,
            }
        })
    }, [])

}

type Options = {
    id: string,
    synced: boolean,
}

export const useBody = (propsFn: () => AddBodyDef | CannonAddBodyDef, options: Partial<Options> = {}) => {

    const {sendMessage} = usePhysicsConsumerContext()
    const [id] = useState(() => options.id ?? generateUUID())

    useEffect(() => {

        const props = propsFn()

        sendMessage({
            type: WorkerMessageType.ADD_BODY,
            data: {
                id,
                props,
                synced: options.synced ?? true,
            },
        })

        return () => {
            sendMessage({
                type: WorkerMessageType.REMOVE_BODY,
                data: {
                    id,
                },
            })
        }

    }, [])

    return [id]

}