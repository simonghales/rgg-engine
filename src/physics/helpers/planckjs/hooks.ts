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

export const useBody = (propsFn: () =>  any, options: Partial<Options> = {}, addToMessage?: (props: any, options: Partial<Options>) => any): [
    MutableRefObject<Object3D>,
    string
] => {

    const {sendMessage} = usePhysicsConsumerContext()
    const [id] = useState(() => options.id ?? generateUUID())
    const localRef = useRef<Object3D>(null as unknown as Object3D)

    const {
        syncBody
    } = usePhysicsConsumerContext()

    const {
        prepareObject
    } = usePhysicsConsumerHelpers() || {}

    // @ts-ignore
    useLayoutEffect(() => {
        if (options.ref) {
            if (!options.ref.current) {
                options.ref.current = new Object3D()
            }
            return syncBody(id, options.ref)
        } else {
            if (!localRef.current) {
                localRef.current = new Object3D()
            }
            return syncBody(id, localRef as MutableRefObject<Object3D>)
        }
    }, [])

    useLayoutEffect(() => {

        const props = propsFn()

        const ref = options.ref || localRef
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

    return [options.ref || localRef, id]

}

export const usePlanckBody = (propsFn: () => AddBodyDef, options: Partial<Options> = {}): [
    MutableRefObject<Object3D>,
    string
] => {
    return useBody(propsFn, options)
}