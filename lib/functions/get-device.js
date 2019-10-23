// name: get-device
// outputs: 1
const debug = env.get("debug");
try {
    const storeType = env.get("store_type") || "memoryOnly";
    const deviceName = env.get("device_name");
    if (!deviceName) throw new Error("Missing env vars"); 
    const storeKey = `device-${deviceName}`;
    if(!storeKey) throw new Error("Missing params");
    if (debug) {
        console.log("get device store_key", storeKey);
    }
    global.get(storeKey, storeType, (err,res) => {
        if(err) throw err;
        msg.device = res;
    }); 
    if (!msg.device || msg.device === null) throw new Error("no device found"); 
    const userId = env.get("user_id");
    msg.parts = [userId, "Device", "HEAD", msg.device.id];
    msg.topic = msg.parts.join("/");
    if (debug) {
        console.log("get device topic", msg.topic);
    }
    return msg;
} catch(error) {
    if (debug) console.log("get device error", error);
    return null;
}
