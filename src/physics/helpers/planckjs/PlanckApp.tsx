import React, { useEffect, useState} from "react";
import {World} from "planck-js";
import {DEFAULT_STEP_RATE} from "../../config";
import PlanckPhysicsHandler from "./PlanckPhysicsHandler";
import {WorkerMessaging} from "../../../generic";

const usePlanckPhysics = () => {

    const [world, setWorld] = useState<World | null>(null)

    useEffect(() => {
        const planckWorld = new World({allowSleep: false})
        setWorld(planckWorld)
    }, [])

    return {
        world,
    }
}

const PlanckApp: React.FC<{
    worker: Worker,
    stepRate?: number,
    maxNumberOfSyncedBodies?: number,
}> = ({children,
                           stepRate = DEFAULT_STEP_RATE,
                           maxNumberOfSyncedBodies = 100,
                           worker}) => {

    const {world} = usePlanckPhysics()

    if (!world) return null

    return (
        <WorkerMessaging worker={worker}>
            <PlanckPhysicsHandler world={world} worker={worker} stepRate={stepRate} maxNumberOfSyncedBodies={maxNumberOfSyncedBodies}>
                {children}
            </PlanckPhysicsHandler>
        </WorkerMessaging>
    );
};

export default PlanckApp;