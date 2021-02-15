import React, {useEffect, useMemo, useRef} from "react";
import {Context} from "./PhysicsProvider.context";
import {OnWorldStepFn} from "./types";
import {createNewPhysicsLoopWebWorker} from "./physicsLoopWorker";
import {getNow} from "../utils/time";

const usePhysicsWorldStepHandler = (onWorldStep: OnWorldStepFn, stepRate: number, paused: boolean) => {

    const localStateRef = useRef({
        lastUpdate: getNow(),
    })

    const {
        stepWorld
    } = useMemo(() => ({
        stepWorld: () => {
            const now = getNow()
            const delta = now - localStateRef.current.lastUpdate
            localStateRef.current.lastUpdate = now
            if (paused) return
            onWorldStep(delta)
        }
    }), [paused, onWorldStep])

    const stepWorldRef = useRef(stepWorld)

    useEffect(() => {
        stepWorldRef.current = stepWorld
    }, [stepWorld])

    useEffect(() => {
        const worker = createNewPhysicsLoopWebWorker(stepRate)
        worker.onmessage = (event) => {
            if (event.data === 'step') {
                stepWorldRef.current()
            }
        }
    }, [stepWorldRef])

    return null
}

const PhysicsProvider: React.FC<{
    onWorldStep: OnWorldStepFn,
    stepRate: number,
}> = ({children, onWorldStep, stepRate}) => {

    const paused = false
    usePhysicsWorldStepHandler(onWorldStep, stepRate, paused)

    return (
        <Context.Provider value={{}}>
            {children}
        </Context.Provider>
    );
};

export default PhysicsProvider;