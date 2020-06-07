// name: parse-devices
// outputs: 1
const debug = env.get("debug");
try {
    if (msg.payload && msg.payload !== null && msg.payload.length > 0) {
        msg.payload.forEach(device => {
            let message;
            const method = "HEAD"; // "PUT"
            const userId = env.get("ALOES_USER_ID");
            if (debug) {
                const deviceName = device.name.toLowerCase();
                console.log("parse-devices : device name", deviceName);
            }
            if (device.sensors && device.sensors !== null) {
               device.sensors.forEach(sensor => {
                    if (debug)  console.log("sensor name", sensor.name);
                    sensor.method = method;
                    message = {sensor, topic: `${userId}/Sensor/${method}/${sensor.id}`};
                    node.send(message);
               });
            }
            message = {device, topic: `${userId}/Device/${method}/${device.id}`};
            node.send(message);
        });
    }
    throw new Error("Wrong payload format")
} catch(error){
    if (debug) {
        console.log("parse-devices error", error.message);
    }
}
