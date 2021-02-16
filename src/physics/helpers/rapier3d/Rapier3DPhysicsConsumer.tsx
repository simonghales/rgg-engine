import React from "react"
import {lerpBody, updateBodyData} from "../cannon/updates";
import PhysicsConsumerHelpers from "../planckjs/PhysicsConsumerHelpers";
import {PhysicsConsumer} from "../../../index";
import {prepareObject} from "./updates";

const Rapier3DPhysicsConsumer: React.FC<{
    worker: Worker,
    stepRate: number,
}> = ({children, worker, stepRate}) => {
    return (
        <PhysicsConsumer updateBodyData={updateBodyData} lerpBody={lerpBody} worker={worker} stepRate={stepRate}>
            <PhysicsConsumerHelpers prepareObject={prepareObject}>
                {children}
            </PhysicsConsumerHelpers>
        </PhysicsConsumer>
    )
}

export default Rapier3DPhysicsConsumer