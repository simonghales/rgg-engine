import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Canvas} from "react-three-fiber";
import {CannonPhysicsConsumer} from "../../src";
import Game from "./Game";
import "./index.css"
import {STEP_RATE} from "./config";

const worker = new Worker("../src/webWorker.ts")

const App = () => {
  return (
    <Canvas>
        <CannonPhysicsConsumer worker={worker} stepRate={STEP_RATE}>
            <Game/>
        </CannonPhysicsConsumer>
    </Canvas>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
