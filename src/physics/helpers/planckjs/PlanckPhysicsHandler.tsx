import React, {useCallback, useMemo, useRef, useState} from "react";
import {World, Body} from "planck-js";
import {Context} from "./PlanckPhysicsHandler.context";
import {Context as AppContext} from "./PlanckApp.context";
import Physics from "../../Physics";
import WorkerSubscription from "./WorkerSubscription";



const usePlanckBodies = () => {

    const [syncedBodies] = useState<{
        [key: string]: Body,
    }>({})
    const [syncedBodiesOrder] = useState<string[]>([])
    const hasPendingSyncedBodiesRef = useRef(0)

    const getPendingSyncedBodiesIteration = useCallback(() => {
        return hasPendingSyncedBodiesRef.current
    }, [])

    const addSyncedBody = useCallback((uid: string, body: Body) => {
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

    return {
        addSyncedBody,
        removeSyncedBody,
        getPendingSyncedBodiesIteration,
        syncedBodiesOrder,
        syncedBodies,
    }

}

const usePhysicsUpdate = () => {

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

const usePlanckPhysics = (world: World, stepRate: number) => {

    const {
        addSyncedBody,
        removeSyncedBody,
        getPendingSyncedBodiesIteration,
        syncedBodies,
        syncedBodiesOrder,
    } = usePlanckBodies()

    const {
        onUpdate,
        subscribeToPhysicsUpdates,
    } = usePhysicsUpdate()

    const {
        onWorldStep
    } = useMemo(() => ({
        onWorldStep: () => {
            world.step(stepRate / 1000)
            world.clearForces()
            onUpdate()
        }
    }), [])

    return {
        onWorldStep,
        subscribeToPhysicsUpdates,
        getPendingSyncedBodiesIteration,
        syncedBodies,
        syncedBodiesOrder,
        addSyncedBody,
        removeSyncedBody,
    }
}

const PlanckPhysicsHandler: React.FC<{
    world: World,
    worker: Worker,
    stepRate: number,
    maxNumberOfSyncedBodies: number,
}> = ({children, world, worker, stepRate, maxNumberOfSyncedBodies}) => {

    const {
        onWorldStep,
        subscribeToPhysicsUpdates,
        getPendingSyncedBodiesIteration,
        syncedBodies,
        syncedBodiesOrder,
        addSyncedBody,
        removeSyncedBody
    } = usePlanckPhysics(world, stepRate)

    return (
        <Context.Provider value={{
            getPendingSyncedBodiesIteration,
            syncedBodies,
            syncedBodiesOrder,
            maxNumberOfSyncedBodies,
        }}>
            <WorkerSubscription worker={worker} subscribe={subscribeToPhysicsUpdates}/>
            <AppContext.Provider value={{
                world,
                addSyncedBody,
                removeSyncedBody,
            }}>
                <Physics onWorldStep={onWorldStep} stepRate={stepRate}>
                    {children}
                </Physics>
            </AppContext.Provider>
        </Context.Provider>
    );
};

export default PlanckPhysicsHandler;