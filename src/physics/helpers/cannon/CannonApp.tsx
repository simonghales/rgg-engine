import { World } from "cannon-es"
import React, {useEffect, useState} from "react"
import CannonPhysicsHandler from "./CannonPhysicsHandler";
import {DEFAULT_STEP_RATE} from "../../config";

const useCannonPhysics = () => {

    const [world, setWorld] = useState<World | null>(null)

    useEffect(() => {

        const cannonWorld = new World()
        cannonWorld.gravity.set(0, -9.81, 0)
        setWorld(cannonWorld)

        cannonWorld.addEventListener('beginContact', () => {
            // todo
        })

        cannonWorld.addEventListener('endContact', () => {
            // todo
        })

    }, [])

    return {
        world,
    }

}

const CannonApp: React.FC<{
    worker: Worker,
    stepRate?: number,
    maxNumberOfSyncedBodies?: number,
}> = ({
                           children,
                           stepRate = DEFAULT_STEP_RATE,
                           maxNumberOfSyncedBodies = 100,
                           worker}) => {

    const {world} = useCannonPhysics()

    if (!world) return null

    return (
        <CannonPhysicsHandler world={world} worker={worker} stepRate={stepRate} maxNumberOfSyncedBodies={maxNumberOfSyncedBodies}>
            {children}
        </CannonPhysicsHandler>
    )
}

export default CannonApp