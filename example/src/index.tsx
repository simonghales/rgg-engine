import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Canvas} from "@react-three/fiber";
import {PlanckPhysicsConsumer, Rapier3DPhysicsConsumer} from "../../src";
import "./index.css"
import {STEP_RATE} from "./config";
import Rapier3DGame from "./Rapier3DGame";
import {useEffect, useState} from "react";

const worker = new Worker("../src/webWorker.ts")

const App = () => {

    const [paused, setPaused] = useState(false)

    // useEffect(() => {
    //     setInterval(() => {
    //         setPaused(state => !state)
    //     }, 500)
    // }, [])

  return (
    <Canvas>
        <PlanckPhysicsConsumer worker={worker} stepRate={STEP_RATE} paused={false}>
            {/*<Rapier3DPhysicsConsumer worker={worker} stepRate={STEP_RATE} paused={paused}>*/}
                <Rapier3DGame/>
            {/*</Rapier3DPhysicsConsumer>*/}
        </PlanckPhysicsConsumer>
    </Canvas>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
