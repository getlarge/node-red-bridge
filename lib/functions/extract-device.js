// name: extract-device
// outputs: 1
try {
    const debug = env.get("debug");
    const storeType = env.get("store_type") || "memoryOnly";
    const deviceName = env.get("device_name");
    if (!deviceName) throw new Error("Missing env vars"); 
    let devicesList;
    global.get("devicesList", storeType, (err, res) => {
        if (err) throw err;
        devicesList = res;
    });
    if (!devicesList || devicesList === null) {
        devicesList = [];
    }
    const index = devicesList.indexOf(deviceName);
    if (debug)  console.log("save device, index", deviceName, index);
    if (index === -1) {
        devicesList.push(deviceName);
        global.set("devicesList", devicesList, "memoryOnly", err => {
            if (err) throw err;
        });
    }
    if (debug) console.log("update devices list", devicesList)
    const storeKey = `device-${deviceName}`;
    //  console.log("saveDevice storeKey : ", storeKey);
    if(!storeKey) throw new Error("Missing params");
    global.set(storeKey, msg.device, storeType, err => {
        if(err) throw err;
    });  
    return msg;
} catch(error) {
    if (debug) console.log("extract device err", error);
    return null;
    // throw error;
}
