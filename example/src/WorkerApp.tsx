import React from "react";
import PlanckApp from "../../src/physics/helpers/planckjs/PlanckApp";

const WorkerApp: React.FC<{
    worker: Worker
}> = ({worker}) => {
    return <PlanckApp worker={worker}/>
};

export default WorkerApp;