import React from "react";
import PhysicsProvider from "./PhysicsProvider";
import {OnWorldStepFn} from "./types";
import {DEFAULT_STEP_RATE} from "./config";

const Physics: React.FC<{
    onWorldStep: OnWorldStepFn,
    stepRate?: number,
}> = ({children, onWorldStep, stepRate = DEFAULT_STEP_RATE}) => {
    console.log('i am physics...')
    return (
        <PhysicsProvider onWorldStep={onWorldStep} stepRate={stepRate}>
            {children}
        </PhysicsProvider>
    );
};

export default Physics;