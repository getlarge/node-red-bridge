// name: is-device-selected
// outputs: 1
const debug = env.get("debug");
try {
    const deviceName = env.get("device_name");
    if (!deviceName) throw new Error("no device name env");
    const compareNames = source => {
        if (source && source !== null) {
          return source === deviceName.toLowerCase();
        }
        return false;
     };
    const index = msg.payload.findIndex(compareNames);
    msg.payload = false;
    if (index > -1) {
        msg.payload = true;
    }
    if (debug) {
        console.log("is-device-selected", index, msg.payload);
    }
    return msg;
} catch(error) {
    if (debug) {
        console.log("is-device-selected error", error.message);
    }
    return null;
}