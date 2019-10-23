// name: find-instance
// outputs: 1
const debug = env.get("debug");
const deviceName = env.get("device_name");
try {
    // pattern : POST/sensor/3339/0/3/5523
    if (msg.topic) {
        const t = msg.topic.split("/");
        const storeType = env.get("store_type") || "memoryOnly";
        const userId = env.get("user_id");
        if (debug)  console.log("instance payload: ", deviceName, msg.topic, msg.payload);

        if (msg.payload === undefined) throw new Error("Missing payload"); 
        if (!userId || !deviceName) throw new Error("Missing env vars"); 
        const method = t[0];
        const collection = t[1].toLowerCase();
        const objectId = t[2];
        const nativeNodeId = t[3] || "0";
        const nativeSensorId = t[4] || "0";
        const resourceId = t[5] || 0;
        const collectionName = `${collection.charAt(0).toUpperCase()}${collection.slice(1)}`;

        if (debug) console.log("instance topic: ", method, collectionName, objectId);

        let storeKey;
        if (collection === "sensor" && objectId && nativeSensorId !== undefined) {
            storeKey = `sensor-${deviceName}-${objectId}-${nativeNodeId}-${nativeSensorId}`;
        } else if (collection === "device") {
            storeKey = `device-${deviceName}`;
        }
        if (debug) console.log("findInstance storeKey : ", storeKey);

        if(!storeKey) throw new Error("Missing params");
        let instance;
        instance = global.get(storeKey);
        // global.get(storeKey, storeType, (err, res) => {
        //    if(err) throw err;
        //    instance = res;
        // });  
        if (!instance) throw new Error('No instance found');
        if (debug) console.log("foundInstance: ", instance.name);

        if (method === "POST") {
            msg.topic = `${userId}/${collectionName}/${method}`;
        } else {
            msg.topic = `${userId}/${collectionName}/${method}/${instance.id}`;
        }
        //  msg.topic = `${userId}/IoTAgent/${method}/${instance.id}`;

        msg[collection] = instance;
        msg.value = msg.payload;
        msg.resource = resourceId;
        msg.method = method;
        msg.attribute = objectId;
        msg.deviceName = deviceName;
        msg.storeKey = storeKey;
        if (debug) console.log("instance params: ", msg.topic, msg.resource);
        return msg;
    }
    throw new Error("Missing params");
} catch(error){
    if (debug) console.log(`${deviceName} Find instance:err `, error);
    return null;
}
