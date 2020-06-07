// name: switch-msg-properties
// outputs: 4
const debug = env.get("debug");
try {
    let deviceName = env.get("device_name");
    if (!deviceName) throw new Error("Missing device_name variable");
    const deviceId = env.get("device_id");
    if (!deviceId) throw new Error("Missing device_id variable");
    deviceName = deviceName.toLowerCase();
    if (msg.device && msg.device !== null && msg.device.id) {
        if (msg.device.id.toString() === deviceId) {
            if (msg.device.status) {
               node.status({fill:"green",shape:"ring",text:"connected"});
            } else {
                node.status({fill:"red",shape:"ring",text:"disconnected"});
            }
            if (msg.device.sensors) {
                delete msg.device.sensors;
            }
            if (debug) {
                console.log("set Device", msg.device);
                const message = {topic: msg.topic, payload : msg.device};
                return [msg, null, null, message];
            }
            return [msg, null, null, null];
        }
        return [null, null, null];
    } else if (msg.sensor && msg.sensor !== null && msg.sensor.deviceId) {
        const deviceId = env.get("device_id");
        if (msg.sensor.deviceId.toString() === deviceId) {
            if (debug) {
                //  console.log("set Sensor", msg.sensor);
                const message = {topic: msg.topic, payload : msg.sensor};
                return [null, msg, null, message];
            }
            return [null, msg, null, null];
        }
        return [null, null, null];
    } else if (msg.measurement && msg.measurement !== null && msg.measurement.deviceId) {
        const deviceId = env.get("device_id");
        if (msg.measurement.deviceId.toString() === deviceId) {
            if (debug) {
                console.log("set Measurement", msg.measurement);
                const message = {topic: msg.topic, payload : msg.measurement};
                return [null, null, msg, message];
            }
            return [null, null, msg, null];
        }
        return [null, null, null, null];
    } 
    throw new Error("No instance to parse");
} catch(error){
    if (debug) {
        console.log(`switch-msg-properties err`, error.message);
    }
    return [null, null, null, null];
}
