// name: get-sensors
// outputs: 1
try {
    const debug = env.get("debug");
    const storeType = env.get("store_type") || "memoryOnly";
    const deviceName = env.get("device_name");
    if (!deviceName ) throw new Error("Missing env vars"); 

    let keys = global.keys(storeType); 
    if (debug) {
        console.log("get keys", keys);
    }
    keys = keys.filter(key => key.startsWith(`sensor-${deviceName}`));
    if (debug) {
        console.log("filtered keys", keys);
    }
    keys.forEach(key => {
        global.get(key, storeType, (err,res) => {
            if(err) throw err;
            msg.sensor = res;
        }); 
        if (!msg.sensor || msg.sensor === null) return null; 
        const userId = env.get("user_id");
        msg.parts = [userId, "Sensor", "HEAD", msg.sensor.id];
        msg.topic = msg.parts.join("/");
        if (debug) console.log("get sensor topic", msg.topic);
        const resourcesKeys = Object.keys(msg.sensor.resources);
        if (debug) console.log("get sensor resources", resourcesKeys);
        resourcesKeys.forEach(resource => {
            msg.sensor.resource = Number(resource);
            msg.sensor.method = "HEAD";
            //  msg.payload = msg.sensor.resources[resource];
            node.send(msg);
        });
    });

    return null;
} catch(error) {
    return null;
}
