import React from "react"
import {PhysicsConsumer} from "../../../index";
import {lerpBody, prepareObject, updateBodyData} from "./updates";
import PhysicsConsumerHelpers from "../planckjs/PhysicsConsumerHelpers";

const CannonPhysicsConsumer: React.FC<{
    worker: Worker,
    stepRate: number,
}> = ({worker, stepRate, children}) => {
    return (
        <PhysicsConsumer updateBodyData={updateBodyData} lerpBody={lerpBody} worker={worker} stepRate={stepRate}>
            <PhysicsConsumerHelpers prepareObject={prepareObject}>
                {children}
            </PhysicsConsumerHelpers>
        </PhysicsConsumer>
    )
}

export default CannonPhysicsConsumer