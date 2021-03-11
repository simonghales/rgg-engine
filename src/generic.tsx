import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react"
import {generateUUID} from "./utils/ids";
import {WorkerMessageData, WorkerMessageType} from "./physics/types";

enum MessageType {
    mounted = 'mounted',
    unmounted = 'unmounted',
    propUpdate = 'propUpdate',
    propRemoved = 'propRemoved',
}

type Message = {
    message: MessageType,
    id: string,
    [key: string]: any,
}

const useSyncComponent = (type: string, id: string, props: any, sendMessage: any) => {

    useEffect(() => {
        sendMessage({
            message: MessageType.mounted,
            id,
            type,
            props,
        })
        return () => {
            sendMessage({
                message: MessageType.unmounted,
                id,
            })
        }
    }, [type, id, sendMessage])

}

const SyncedComponentProp: React.FC<{
    id: string,
    propKey: string,
    value: any,
    sendMessage: any,
}> = ({propKey, id, value, sendMessage}) => {
    const firstUpdateRef = useRef(true)
    useEffect(() => {
        if (firstUpdateRef.current) {
            firstUpdateRef.current = false
            return
        }
        sendMessage({
            message: MessageType.propUpdate,
            id,
            value,
            propKey,
        })
    }, [value, id, propKey])
    useEffect(() => {
        return () => {
            sendMessage({
                message: MessageType.propRemoved,
                id,
                propKey,
            })
        }
    }, [id, propKey])
    return null
}

export const SyncedComponent: React.FC<{
    [key: string]: any,
    type: string,
    id?: string,
}> = ({type, id: passedId, ...props}) => {

    const sendMessage = useWorkerSendMessage()

    const [id] = useState(() => passedId ?? generateUUID())

    useSyncComponent(type, id, props, sendMessage)

    return (
        <>
            {
                Object.entries(props).map(([key, value]) => (
                    <SyncedComponentProp key={key} id={id} propKey={key} value={value} sendMessage={sendMessage}/>
                ))
            }
        </>
    )
}

const Context = createContext<{
    sendMessage: (message: any) => void,
    worker: Worker,
}>(null!)

export const useWorkerSendMessage = () => {
    return useContext(Context).sendMessage
}

export const useWorker = () => {
    return useContext(Context).worker
}

export const WorkerMessaging: React.FC<{
    worker: Worker
}> = ({worker, children}) => {

    const sendMessage = useCallback((message: any) => {
        worker.postMessage({
            type: WorkerMessageType.CUSTOM,
            message,
        })
    }, [worker])

    return (
        <Context.Provider value={{sendMessage, worker}}>
            {children}
        </Context.Provider>
    )

}

export const SyncComponents: React.FC<{
    components: {
        [key: string]: any,
    }
}> = ({components}) => {


    const worker = useWorker()

    const [storedComponents, setComponents] = useState<{
        [key: string]: {
            id: string,
            type: string,
            props: {
                [key: string]: any,
            }
        }
    }>({})

    const handleCustomMessage = useCallback((message: Message) => {
        const {id, type, value, propKey} = message
        switch (message.message) {
            case MessageType.mounted:
                setComponents(state => ({
                    ...state,
                    [id]: {
                        id,
                        type,
                        props: value,
                    }
                }))
                break;
            case MessageType.unmounted:
                setComponents(state => {
                    const updated = {
                        ...state,
                    }
                    delete updated[id]
                    return updated
                })
                break;
            case MessageType.propUpdate:
                setComponents(state => {
                    const existing = state[id] ?? {
                        props: {},
                    }
                    return {
                        ...state,
                        [id]: {
                            ...existing,
                            props: {
                                ...existing.props,
                                [propKey]: value,
                            }
                        }
                    }
                })
                break;
            case MessageType.propRemoved:
                setComponents(state => {
                    const existing = state[id] ?? {
                        props: {},
                    }
                    const updatedProps = {
                        ...existing.props
                    }
                    delete updatedProps[propKey]
                    return {
                        ...state,
                        [id]: {
                            ...existing,
                            props: updatedProps,
                        }
                    }
                })
                break;
        }
    }, [])

    useEffect(() => {
        const previousOnMessage = worker.onmessage

        worker.onmessage = (event: any) => {

            if (previousOnMessage) {
                // @ts-ignore
                previousOnMessage(event)
            }

            const message = event.data as WorkerMessageData

            if (message.type === WorkerMessageType.CUSTOM) {
                handleCustomMessage(message.message as Message)
            }

        }

        return () => {
            worker.onmessage = previousOnMessage
        }

    }, [])

    return (
        <>
            {
                Object.entries(storedComponents).map(([key, component]) => {
                    const Component = components[component.type]
                    if (!Component) return null
                    return <Component id={key} {...component.props} key={key}/>
                })
            }
        </>
    )
}