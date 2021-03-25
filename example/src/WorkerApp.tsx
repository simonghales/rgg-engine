import React, {useEffect} from "react";
import PlanckApp from "../../src/physics/helpers/planckjs/PlanckApp";
import {CannonApp, Rapier3DApp, usePlanckAppContext} from "../../src";
import {BodyDef, Circle, Shape, Vec2} from "planck-js";
import {STEP_RATE} from "./config";

const Game: React.FC = () => {

    const {
        world,
        addSyncedBody,
        addBody,
    } = usePlanckAppContext()

    useEffect(() => {

        return

        const bodyDef: BodyDef = {
            type: 'dynamic',
            allowSleep: false,
            fixedRotation: true,
            position: Vec2(2, 2),
            linearDamping: 40,
        }
        const body = world.createBody(bodyDef)
        const circle = Circle()
        body.createFixture(circle as unknown as Shape, {
            density: 10,
        } as any)

        setInterval(() => {
            body.setLinearVelocity(Vec2(-3, 0))
        }, 10)

        return addBody('player', body, true)

    }, [])

    return null
}

const WorkerApp: React.FC<{
    worker: Worker
}> = ({worker}) => {
    return (
        <PlanckApp worker={worker} stepRate={STEP_RATE}/>
    )
};

export default WorkerApp;