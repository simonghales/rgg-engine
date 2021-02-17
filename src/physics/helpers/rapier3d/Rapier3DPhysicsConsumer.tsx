import React from "react"
import {lerpBody, updateBodyData} from "../cannon/updates";
import PhysicsConsumerHelpers from "../planckjs/PhysicsConsumerHelpers";
import {PhysicsConsumer} from "../../../index";
import {prepareObject} from "./updates";
import {DefaultPhysicsConsumerProps} from "../../PhysicsConsumer";

const Rapier3DPhysicsConsumer: React.FC<DefaultPhysicsConsumerProps> = ({children, ...props}) => {
    return (
        <PhysicsConsumer updateBodyData={updateBodyData} lerpBody={lerpBody} {...props}>
            <PhysicsConsumerHelpers prepareObject={prepareObject}>
                {children}
            </PhysicsConsumerHelpers>
        </PhysicsConsumer>
    )
}

export default Rapier3DPhysicsConsumer