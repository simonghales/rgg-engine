import React, {useCallback, useMemo, useRef, useState} from "react";
import {World} from "planck-js";
import {Context} from "./PlanckPhysicsHandler.context";
import {Context as AppContext} from "./PlanckApp.context";
import Physics from "../../Physics";
import WorkerSubscription from "./WorkerSubscription";
import PlanckPhysicsWorkerMessagesHandler from "./PlanckPhysicsWorkerMessagesHandler";
import {applyBufferData} from "./updates";
import {generateBuffers} from "./buffers";


export const usePhysicsBodies = (removeBody: any) => {

    const [bodies] = useState<{
        [key: string]: any,
    }>({})
    const [syncedBodies] = useState<{
        [key: string]: any,
    }>({})
    const [syncedBodiesOrder] = useState<string[]>([])
    const hasPendingSyncedBodiesRef = useRef(0)

    const getPendingSyncedBodiesIteration = useCallback(() => {
        return hasPendingSyncedBodiesRef.current
    }, [])

    const addSyncedBody = useCallback((uid: string, body: any) => {
        syncedBodiesOrder.push(uid)
        syncedBodies[uid] = body
        hasPendingSyncedBodiesRef.current += 1
        return () => {
            const index = syncedBodiesOrder.indexOf(uid)
            syncedBodiesOrder.splice(index, 1)
            delete syncedBodies[uid]
            hasPendingSyncedBodiesRef.current += 1
        }
    }, [])

    const removeSyncedBody = useCallback((uid: string) => {
        const index = syncedBodiesOrder.indexOf(uid)
        syncedBodiesOrder.splice(index, 1)
        delete syncedBodies[uid]
        hasPendingSyncedBodiesRef.current += 1
    }, [])

    const addBody = useCallback((uid: string, body: any, synced: boolean = false) => {
        bodies[uid] = body
        let syncedUnsub: any
        if (synced) {
            syncedUnsub = addSyncedBody(uid, body)
        }
        return () => {
            delete bodies[uid]
            if (syncedUnsub) {
                syncedUnsub()
            }
            if (removeBody) {
                removeBody(body)
            }
        }
    }, [])

    return {
        addSyncedBody,
        removeSyncedBody,
        getPendingSyncedBodiesIteration,
        syncedBodiesOrder,
        syncedBodies,
        addBody,
        bodies,
    }

}

export const usePhysicsUpdate = () => {

    const countRef = useRef(0)

    const workerSubscriptionsRef = useRef<{
        [key: string]: () => void,
    }>({})

    const subscribeToPhysicsUpdates = useCallback((callback: () => void) => {
        const id = countRef.current.toString()
        countRef.current += 1
        workerSubscriptionsRef.current[id] = callback

        return () => {
            delete workerSubscriptionsRef.current[id]
        }

    }, [])

    const onUpdate =  useCallback(() => {

        Object.values(workerSubscriptionsRef.current).forEach(callback => callback())

    }, [])

    return {
        onUpdate,
        subscribeToPhysicsUpdates,
    }

}

export const usePhysics = (removeBody: any = () => {}) => {

    const {
        addSyncedBody,
        removeSyncedBody,
        getPendingSyncedBodiesIteration,
        syncedBodies,
        syncedBodiesOrder,
        addBody,
        bodies,
    } = usePhysicsBodies(removeBody)

    const {
        onUpdate,
        subscribeToPhysicsUpdates,
    } = usePhysicsUpdate()

    return {
        subscribeToPhysicsUpdates,
        getPendingSyncedBodiesIteration,
        syncedBodies,
        syncedBodiesOrder,
        addSyncedBody,
        removeSyncedBody,
        addBody,
        bodies,
        onUpdate,
    }
}

const PlanckPhysicsHandler: React.FC<{
    world: World,
    worker: Worker,
    stepRate: number,
    maxNumberOfSyncedBodies: number,
}> = ({children, world, worker, stepRate, maxNumberOfSyncedBodies}) => {

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
            world.step(stepRate / 1000)
            world.clearForces()
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
                <PlanckPhysicsWorkerMessagesHandler world={world} worker={worker}/>
                <Physics onWorldStep={onWorldStep} stepRate={stepRate}>
                    {children}
                </Physics>
            </AppContext.Provider>
        </Context.Provider>
    );
};

export default PlanckPhysicsHandler;