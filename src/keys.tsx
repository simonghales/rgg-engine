import {useEffect} from "react";
import create from "zustand";

export const useTransferKeyEvents = (worker: Worker) => {

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.repeat) return
            const {
                code,
                key,
                keyCode
            } = event
            worker.postMessage({
                type: 'KEYDOWN',
                data: {
                    code,
                    key,
                    keyCode,
                }
            })
        }
        const onKeyUp = (event: KeyboardEvent) => {
            const {
                code,
                key,
                keyCode
            } = event
            worker.postMessage({
                type: 'KEYUP',
                data: {
                    code,
                    key,
                    keyCode,
                }
            })
        }
        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('keyup', onKeyUp)

        return () => {
            window.removeEventListener('keydown', onKeyDown)
            window.removeEventListener('keyup', onKeyUp)
        }

    }, [])

}

export const useActiveKeys = create<{
    activeKeys: {
        [key: number]: boolean,
    }
}>(() => ({
    activeKeys: {},
}))

export const rawActiveKeys: {
    [key: number]: boolean,
} = {}

const setActiveKey = (code: number, active: boolean) => {
    rawActiveKeys[code] = active
    return useActiveKeys.setState(state => ({
        activeKeys: {
            ...state.activeKeys,
            [code]: active,
        }
    }))
}

export const useHandleKeyEvents = (worker: Worker) => {

    useEffect(() => {

        const previousOnMessage = worker.onmessage as any

        worker.onmessage = (event: any) => {

            if (previousOnMessage) {
                previousOnMessage(event)
            }

            const data = event.data

            switch (data.type) {
                case 'KEYUP':
                    setActiveKey(data.data.keyCode, false)
                    break;
                case 'KEYDOWN':
                    setActiveKey(data.data.keyCode, true)
                    break;
            }

        }

        return () => {
            worker.onmessage = previousOnMessage
        }

    }, [worker])

}