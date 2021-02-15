export const createNewPhysicsLoopWebWorker = (stepRate: number) => {
    return new Worker('data:application/javascript,' +
        encodeURIComponent(`
            
            var start = performance.now();
            var updateRate = ${stepRate};
            
            function getNow() {
                return start + performance.now();
            }
            
            var lastUpdate = getNow();
            var accumulator = 0;
            
            while(true) {
                var now = getNow();
                var delta = now - lastUpdate;
                lastUpdate = now;
                
                accumulator += delta;
                
                if (accumulator > updateRate) {
                    accumulator -= updateRate;
                    self.postMessage('step')
                }
                
            }
        `) );
}