import React, {useEffect, useMemo, useRef} from "react";
import {Context} from "./PhysicsProvider.context";
import {OnWorldStepFn} from "./types";
import {createNewPhysicsLoopWebWorker} from "./physicsLoopWorker";
import {getNow} from "../utils/time";
import {useFixedUpdateContext} from "./PhysicsConsumer";

let now = 0
let delta = 0

const usePhysicsWorldStepHandler = (onWorldStep: OnWorldStepFn, stepRate: number, paused: boolean) => {

    const localStateRef = useRef({
        lastUpdate: getNow(),
    })

    const {
        updateSubscriptions
    } = useFixedUpdateContext()

    const {
        stepWorld
    } = useMemo(() => ({
        stepWorld: () => {
            now = getNow()
            delta = now - localStateRef.current.lastUpdate
            localStateRef.current.lastUpdate = now
            if (paused) return
            onWorldStep(delta)
            updateSubscriptions(delta)
        }
    }), [paused, onWorldStep, updateSubscriptions])

    const stepWorldRef = useRef(stepWorld)

    useEffect(() => {
        stepWorldRef.current = stepWorld
    }, [stepWorld])

    useEffect(() => {
        const worker = createNewPhysicsLoopWebWorker(stepRate)
        // let lastStep = getNow()
        worker.onmessage = (event) => {
            if (event.data === 'step') {
                // now = getNow()
                // delta = now - lastStep
                // lastStep = now
                // console.log('delta', delta)
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