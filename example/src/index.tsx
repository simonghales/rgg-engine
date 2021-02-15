import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {PhysicsConsumer} from "../../src";
import Game from "./Game";
import {Canvas} from "react-three-fiber";

const worker = new Worker("../src/webWorker.ts")

const App = () => {
  return (
    <div>
        <Canvas>
            <PhysicsConsumer worker={worker} stepRate={1000 / 30}>
                <Game/>
            </PhysicsConsumer>
        </Canvas>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
