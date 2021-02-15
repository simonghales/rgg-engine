import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {PhysicsConsumer} from "../../src";

const worker = new Worker("../src/webWorker.ts")

const App = () => {
  return (
    <div>
        <PhysicsConsumer worker={worker}>
            hello world
        </PhysicsConsumer>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
