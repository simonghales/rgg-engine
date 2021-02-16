import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Canvas} from "react-three-fiber";
import {Rapier3DPhysicsConsumer} from "../../src";
import "./index.css"
import {STEP_RATE} from "./config";
import Rapier3DGame from "./Rapier3DGame";

const worker = new Worker("../src/webWorker.ts")

const App = () => {
  return (
    <Canvas>
        <Rapier3DPhysicsConsumer worker={worker} stepRate={STEP_RATE}>
            <Rapier3DGame/>
        </Rapier3DPhysicsConsumer>
    </Canvas>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
