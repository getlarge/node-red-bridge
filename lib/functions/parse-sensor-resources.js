// name: parse-sensor-resources
// outputs: 1
const debug = env.get("debug");
try {
    if (msg.payload && Object.keys(msg.payload).length) {
        msg.sensor.resources = msg.payload;
        return msg;
    }
    throw new Error("Wrong payload format")
} catch(error){
    if (debug) {
        console.log("parse-sensors error", error.message);
    }
    return null;
}
