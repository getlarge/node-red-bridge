// name: save-sensor
// outputs: 1
const debug = env.get("debug");
try {
    const storeType = env.get("store_type") || "memoryOnly";
    const deviceName = env.get("device_name");
    if (!deviceName) throw new Error("Missing env vars");
    msg.objectId = msg.sensor.type;
    msg.resourceId = msg.sensor.resource;
    msg.nativeNodeId = msg.sensor.nativeNodeId || '0';
    msg.nativeSensorId = msg.sensor.nativeSensorId;
    const storeKey = `sensor-${deviceName}-${msg.objectId}-${msg.nativeNodeId}-${msg.nativeSensorId}`;
    if (debug) {
        console.log("save sensor storeKey : ", storeKey)
    }
    if(!storeKey) throw new Error("Missing params");
    global.set(storeKey, msg.sensor, storeType, err => {
        if(err) throw err;
    });  
    return msg;
} catch(error){
    if (debug) {
        console.log("save sensor, error", error.message)
    }
    return null;
}
