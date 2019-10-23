// name: map-time-to-leds
// outputs: 1
if (msg.sensor && msg.sensor.resources) {
    msg.wholeTime = msg.sensor.resources["5521"];
    msg.timeLeft = msg.sensor.resources["5538"];
    console.log(`timer ${msg.sensor.resource} , wholeTime : ${msg.wholeTime} , timeLeft : ${msg.timeLeft}`);
    // const ledsCount = 40;
    const mapValuetoRange = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;
    // msg.payload = mapValuetoRange(msg.timeLeft, 0, msg.wholeTime, 0, 100);
    
    msg.payload = null;
    if (msg.sensor.resource === 5523) {
        if (msg.sensor.resources["5523"] === "stop") {
            msg.payload = 0;
        } else if (msg.sensor.resources["5523"] === "pause") {
            msg.payload = mapValuetoRange(msg.timeLeft, 0, msg.wholeTime, 100, 0);
        } else if (msg.sensor.resources["5523"] === "restart") {
            msg.payload = mapValuetoRange(msg.timeLeft, 0, msg.wholeTime, 100, 0);
        } else if (msg.sensor.resources["5523"] === "start") {
            msg.payload = mapValuetoRange(msg.wholeTime, 0, msg.wholeTime, 100, 0);
        }
    } else if (msg.sensor.resource === 5850 ) {
        if (msg.sensor.resources["5850"] === 0) {
            msg.payload = 0;
        } else if (msg.sensor.resources["5850"] === 1) {
            msg.payload = mapValuetoRange(msg.wholeTime, 0, msg.wholeTime, 100, 0);
        }
    } else if (msg.sensor.resource === 5543 ) {
        if (msg.sensor.resources["5543"]) {
            msg.payload = 100;
        }
    } 
    if (msg.payload === null) {
        msg.payload = mapValuetoRange(msg.timeLeft, 0, msg.wholeTime, 100, 0);
    }
    
    if (msg.payload === 0) {
        msg.topic = `PUT/sensor/3306/0/1/5850`;
    } else {
        msg.topic = `PUT/sensor/3311/0/2/5851`;
    }
    return msg;
}
