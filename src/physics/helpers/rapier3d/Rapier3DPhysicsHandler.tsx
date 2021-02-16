import React, {useMemo} from "react"
import {World} from "@dimforge/rapier3d-compat/rapier.js";
import {usePhysics} from "../planckjs/PlanckPhysicsHandler";
import {Context} from "../planckjs/PlanckPhysicsHandler.context";
import WorkerSubscription from "../planckjs/WorkerSubscription";
import {generateBuffers} from "../cannon/buffers";
import {Context as AppContext} from "../planckjs/PlanckApp.context";
import Physics from "../../Physics";
import {applyBufferData} from "./updates";
import Rapier3DPhysicsWorkerMessagesHandler from "./Rapier3DPhysicsWorkerMessagesHandler";

const Rapier3DPhysicsHandler: React.FC<{
    world: World,
    worker: Worker,
    stepRate: number,
    maxNumberOfSyncedBodies: number,
}> = ({
    children,
    world,
    stepRate,
    worker,
    maxNumberOfSyncedBodies
}) => {

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
    } = usePhysics()

    const {
        onWorldStep
    } = useMemo(() => ({
        onWorldStep: () => {
            world.step()
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
                <Rapier3DPhysicsWorkerMessagesHandler world={world} worker={worker}/>
                <Physics onWorldStep={onWorldStep} stepRate={stepRate}>
                    {children}
                </Physics>
            </AppContext.Provider>
        </Context.Provider>
    )
}

export default Rapier3DPhysicsHandler