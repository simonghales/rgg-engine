import React from "react";
import PhysicsProvider from "./PhysicsProvider";
import {OnWorldStepFn} from "./types";
import {DEFAULT_STEP_RATE} from "./config";
import {OnFixedUpdateProvider} from "./PhysicsConsumer";

const Physics: React.FC<{
    onWorldStep: OnWorldStepFn,
    stepRate?: number,
}> = ({children, onWorldStep, stepRate = DEFAULT_STEP_RATE}) => {
    return (
        <OnFixedUpdateProvider>
            <PhysicsProvider onWorldStep={onWorldStep} stepRate={stepRate}>
                {children}
            </PhysicsProvider>
        </OnFixedUpdateProvider>
    );
};

export default Physics;