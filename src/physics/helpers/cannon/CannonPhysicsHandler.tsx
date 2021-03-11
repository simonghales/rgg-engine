import { World, Body } from "cannon-es"
import React, {useCallback, useMemo, useRef} from "react"
import {getNow} from "../../../utils/time";
import Physics from "../../Physics";
import WorkerSubscription from "../planckjs/WorkerSubscription";
import {usePhysics} from "../planckjs/PlanckPhysicsHandler";
import {Context} from "../planckjs/PlanckPhysicsHandler.context";
import {Context as AppContext} from "../planckjs/PlanckApp.context";
import CannonPhysicsWorkerMessagesHandler from "./CannonPhysicsWorkerMessagesHandler";
import {applyBufferData} from "./updates";
import {generateBuffers} from "./buffers";

const CannonPhysicsHandler: React.FC<{
    world: World,
    worker: Worker,
    stepRate: number,
    maxNumberOfSyncedBodies: number,
}> = ({children, world, stepRate, worker, maxNumberOfSyncedBodies}) => {

    const removeBody = useCallback((body: Body) => {
        world.removeBody(body)
    }, [])

    const {
        subscribeToPhysicsUpdates,
        getPendingSyncedBodiesIteration,
        syncedBodies,
        syncedBodiesOrder,
        addSyncedBody,
        removeSyncedBody,
        addBody,
        bodies,
        onUpdate,
    } = usePhysics(removeBody)

    const localStateRef = useRef({
        lastUpdate: getNow()
    })

    const {
        onWorldStep
    } = useMemo(() => ({
        onWorldStep: () => {
            const now = getNow()
            const delta = (now - localStateRef.current.lastUpdate) / 1000;
            localStateRef.current.lastUpdate = now;
            world.step(stepRate / 1000, delta)
            onUpdate()
        }
    }), [])

    return (
        <Context.Provider value={{
            getPendingSyncedBodiesIteration,
            syncedBodies,
            syncedBodiesOrder,
            maxNumberOfSyncedBodies,
        }}>
            <WorkerSubscription applyBufferData={applyBufferData} generateBuffers={generateBuffers}
                                worker={worker} subscribe={subscribeToPhysicsUpdates}/>
            <AppContext.Provider value={{
                world,
                addSyncedBody,
                removeSyncedBody,
                addBody,
                bodies,
            }}>
                <CannonPhysicsWorkerMessagesHandler world={world} worker={worker}/>
                <Physics onWorldStep={onWorldStep} stepRate={stepRate}>
                    {children}
                </Physics>
            </AppContext.Provider>
        </Context.Provider>
    )
}

export default CannonPhysicsHandler