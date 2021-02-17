export const createNewPhysicsLoopWebWorker = (stepRate: number) => {
    return new Worker('data:application/javascript,' +
        encodeURIComponent(`
            
            var start = performance.now();
            var updateRate = ${stepRate};
            var maxAccumulator = updateRate;
            
            function getNow() {
                return start + performance.now();
            }
            
            var accumulator = 0;
            var lastAccumulation = getNow();
            var now = getNow();
            var numberOfUpdates = 0;
            
            function accumulate() {
                now = getNow();
                accumulator += now - lastAccumulation;
                lastAccumulation = now;
                while (accumulator <= maxAccumulator) {
                    now = getNow();
                    accumulator += now - lastAccumulation;
                    lastAccumulation = now;
                }
                numberOfUpdates = Math.floor(accumulator / maxAccumulator);
                for (var i = 0; i < numberOfUpdates; i++) {
                    self.postMessage('step');
                    accumulator -= maxAccumulator;
                }
            }
        
            function step() {
                
                accumulate();
                
                setTimeout(step, updateRate - 2 - accumulator);
                
            }
            
            step()
            
        `) );
}