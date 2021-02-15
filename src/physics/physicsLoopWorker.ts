export const createNewPhysicsLoopWebWorker = (stepRate: number) => {
    return new Worker('data:application/javascript,' +
        encodeURIComponent(`
            
            var start = performance.now();
            var updateRate = ${stepRate};
            
            function getNow() {
                return start + performance.now();
            }
            
            var lastUpdate = -1;
            var accumulator = 0;
        
            function step() {
                if (lastUpdate < 0) {
                    lastUpdate = getNow() - updateRate;
                }
                var now = getNow();
                var delta = now - lastUpdate;
                lastUpdate = now;

                accumulator += delta;

                if (accumulator > updateRate) {
                    accumulator = 0;
                    self.postMessage('step');
                } else {
                    var difference = updateRate - accumulator;
                    if (difference < 3) {
                        var start = getNow();
                        var endTime = start + difference;
                        var now = getNow(); 
                        while (now < endTime) {    
                            now = getNow();
                        }
                        accumulator = 0;
                        self.postMessage('step');
                    }
                }
                
                setTimeout(step, updateRate - 3);
                
            }
            
            step()
            
        `) );
}