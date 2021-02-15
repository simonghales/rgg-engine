import React from "react"
import {PhysicsConsumer} from "../../../index";
import {lerpBody, updateBodyData} from "./updates";

const CannonPhysicsConsumer: React.FC<{
    worker: Worker,
    stepRate: number,
}> = ({worker, stepRate, children}) => {
    return (
        <PhysicsConsumer updateBodyData={updateBodyData} lerpBody={lerpBody} worker={worker} stepRate={stepRate}>
            {children}
        </PhysicsConsumer>
    )
}

export default CannonPhysicsConsumer