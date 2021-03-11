import React, {useCallback, useEffect, useState} from "react"
import * as RAPIER from "@dimforge/rapier3d-compat/rapier.js"
import {DEFAULT_STEP_RATE} from "../../config";
import Rapier3DPhysicsHandler from "./Rapier3DPhysicsHandler";
import {CustomBodyModifiers, customData} from "./custom";

const useRapier3dPhysics = (stepRate: number) => {

    const [world, setWorld] = useState<RAPIER.World | null>(null)

    const init = useCallback(async () => {
        // @ts-ignore
        await RAPIER.init()

        const gravity = new RAPIER.Vector3(0.0, -9.81, 0.0);
        const rapierWorld = new RAPIER.World(gravity);
        rapierWorld.timestep = stepRate / 1000
        setWorld(rapierWorld)

    }, [])

    useEffect(() => {
        init()
    }, [])

    return {
        world,
    }

}

const Rapier3DApp: React.FC<{
    worker: Worker,
    stepRate?: number,
    maxNumberOfSyncedBodies?: number,
    customBodyModifiers?: CustomBodyModifiers
}> = ({
                             children,
                             stepRate = DEFAULT_STEP_RATE,
                             maxNumberOfSyncedBodies = 100,
                             customBodyModifiers = {},
                             worker}) => {

    const {world} = useRapier3dPhysics(stepRate)

    useEffect(() => {
        customData.customBodyModifiers = customBodyModifiers
    }, [customBodyModifiers])

    if (!world) return null

    return (
        <Rapier3DPhysicsHandler world={world} worker={worker} stepRate={stepRate} maxNumberOfSyncedBodies={maxNumberOfSyncedBodies}>
            {children}
        </Rapier3DPhysicsHandler>
    )
}

export default Rapier3DApp