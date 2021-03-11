import {AddBodyDef} from "./types";
import {MutableRefObject, useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {generateUUID} from "../../../utils/ids";
import {usePhysicsConsumerContext} from "../../PhysicsConsumer.context";
import {WorkerMessageType} from "../../types";
import {Object3D} from "three";
import {usePhysicsConsumerHelpers} from "./PhysicsConsumerHelpers";

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

export type Options = {
    id?: string,
    synced?: boolean,
    listenForCollisions?: boolean,
    ref?: MutableRefObject<Object3D>,
}

export const useSyncBody = (id: string, ref: MutableRefObject<Object3D> | undefined) => {
    const {
        syncBody
    } = usePhysicsConsumerContext()
    // @ts-ignore
    useLayoutEffect(() => {
        if (!ref) return
        if (!ref.current) {
            ref.current = new Object3D()
        }
        return syncBody(id, ref as MutableRefObject<Object3D>)
    }, [ref])
}

export const useBody = (propsFn: () =>  any, options: Partial<Options> = {}, addToMessage?: (props: any, options: Partial<Options>) => any): [
    MutableRefObject<Object3D>,
    string
] => {

    const {sendMessage} = usePhysicsConsumerContext()
    const [id] = useState(() => options.id ?? generateUUID())
    const localRef = useRef<Object3D>(null as unknown as Object3D)

    const {
        prepareObject
    } = usePhysicsConsumerHelpers() || {}

    const [ref] = useState(() => options.ref || localRef)

    useSyncBody(id, ref)

    useLayoutEffect(() => {

        const props = propsFn()

        const object = ref.current

        if (prepareObject) {
            prepareObject(object, props)
        }

        sendMessage({
            type: WorkerMessageType.ADD_BODY,
            data: {
                id,
                props,
                synced: options.synced ?? true,
                ...(addToMessage ? addToMessage(props, options) : {})
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

    return [ref, id]

}

export const usePlanckBody = (propsFn: () => AddBodyDef, options: Partial<Options> = {}): [
    MutableRefObject<Object3D>,
    string
] => {
    return useBody(propsFn, options)
}