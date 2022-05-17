'use strict'
class BasicMovement2D {
    //from/to [x, y]
    //duration (sec), speed (points/sec)
    moveTo(from, to, duration, speed) {
        const [vectorStep, pathLength] = this.Vector(from, to);
        const [logger, result] = this.LogMovements();

        let passedLength = 0;

        for(let i = 1; i <= duration; i++) {
            console.log(passedLength + speed, pathLength);
            if (passedLength + speed >= pathLength) {
                logger(i, speed, to);
                continue
            }
            passedLength += speed;
            const [x, y] = vectorStep(speed)
            logger(i, speed,[x, y]);
        }
        return result;
    }
//
    moveToDynamic(from, to, duration, speed) {
        const [vectorStep, pathLength] = this.Vector(from, to);
        const [logger, result] = this.LogMovements();
        const [accelerator, acceleratedSpeed] = this.SpeedCounterAcceleration(speed, duration);

        let passedLength = 0;

        for(let i = 1; i <= duration; i++) {
            console.log(passedLength + speed, pathLength);
            if (passedLength + speed >= pathLength) {
                logger(i, speed, to);
                continue
            }
            if (passedLength <= (pathLength / 3)) {
                console.log('work acc')
                accelerator();
                passedLength += acceleratedSpeed[0]
                logger(i, acceleratedSpeed, vectorStep(acceleratedSpeed));
                continue
            }
            if (passedLength >= pathLength - (pathLength / 3)) {
                console.log('work brake')
                accelerator(true);
                passedLength += acceleratedSpeed[0]
                logger(i, acceleratedSpeed, vectorStep(acceleratedSpeed));
                continue
            }
            passedLength += speed;
            const [x, y] = vectorStep(speed)
            logger(i, speed,[x, y]);
        }
        return result;
    }


    //radians - radians to rotate, speed - radians/second
    rotate(from, radians, speed) {
        const [logger, result] = this.LogMovements();

        let currentRotation = from;
        
        const MAX_RAD = (Math.PI*2).toFixed(5);
        
        speed = radians < 0 ? speed *= -1 : speed;
        console.log(currentRotation, MAX_RAD, speed, Math.floor(Math.abs(radians / speed)));
        for (let i = 1; i <= Math.floor(Math.abs(radians / speed)); i++) {
            currentRotation += speed;
            if (currentRotation > MAX_RAD) {
                currentRotation -= MAX_RAD;
            }
            else if (currentRotation < 0) {
                currentRotation = MAX_RAD + currentRotation;
                
            }
            logger(i, speed ,currentRotation);
        }
        currentRotation += (radians % speed);
        console.log(result);
        return result;
    }









    //-------Auxilary functions-------

    SpeedCounterAcceleration(speed, duration) {
        let currentSpeed = [0];
        return [(isReverse) => {
            let accRate = (speed / ((Math.floor(duration / 3)) || 1));
            if (isReverse) {
                accRate *= -1;
                currentSpeed[0] = speed;
            }
            console.log('accrate', currentSpeed, accRate);
            currentSpeed[0] += accRate;
        }, currentSpeed]
    }



    LogMovements() {
        const result = [[],[], []];
        return [( time, speed, ...cords) => {
            console.log(time, cords)
            result[0].push(`time: ${time}`);
            result[1].push(`position (x, y): ${cords}`);
            result[2].push(`speed ${speed}`)
        }, result]
    }

    Vector(from, to) {
        const projectionX = to[0] - from[0];
        const projectionY = to[1] - from[1];

        const pathLength = Math.sqrt(projectionX**2 + projectionY**2)

        const angleToX = projectionX != 0 ? Math.atan(projectionY / projectionX) : Math.PI / 2;

        return [(stepLength) => {  
            let stepProjectionX = projectionX != 0 ? Math.cos(angleToX) * stepLength : 0;
            let stepProjectionY = Math.sin(angleToX) * stepLength;
            if (projectionX < 0 ) {
                stepProjectionX *= -1;
                stepProjectionY *= -1;
            }
            if(projectionX === 0 && projectionY < 0) {
                stepProjectionY *= -1;
            }
            

            return [from[0] += stepProjectionX, from[1] += stepProjectionY]
        }, pathLength]    
    }
}

const basicMovement = new BasicMovement2D();

console.log(basicMovement.moveTo([0, 0], [0, 5], 6, 1));//ok
console.log(basicMovement.moveTo([0, 0], [5, 5], 6, 1));//ok
console.log(basicMovement.moveTo([0, 0], [5, 0], 6, 1));//ok
console.log(basicMovement.moveTo([0, 0], [5, -5], 6, 1));//ok
console.log(basicMovement.moveTo([0, 0], [0, -5], 6, 1));//wrong
console.log(basicMovement.moveTo([0, 0], [-5, -5], 6, 1));//OK
console.log(basicMovement.moveTo([0, 0], [-5, 0], 6, 1));//OK
console.log(basicMovement.moveTo([0, 0], [-5, 5], 6, 1));//OK