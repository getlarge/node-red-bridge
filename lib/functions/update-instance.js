// name: update-instance
// outputs: 2
const debug = env.get("debug");
try {
    const storeType = env.get("store_type") || "memoryOnly";
    //  console.log("resource : ", msg.resource);
    if (msg.payload === undefined) throw new Error("undefined sensor.value");
    if (msg.device) {
        if (msg.device[msg.resource] !== undefined) {
            msg.device[msg.resource] = msg.value;
        }
        msg.payload = msg.device;
        global.set(msg.storeKey, msg.device, storeType, (err) => {
            if(err) throw err;
        });  
        if (debug) console.log("updateInstance:res ", msg.device.name, msg.resource, msg.value);
        if (debug) return [msg, msg];
        return [msg,null];
    } else if (msg.sensor && msg.resource) {
        let updater; 
        global.get("aloesHandlers", storeType, (err,res) => {
            if (err) throw err;
            updater = res.updateAloesSensors;
        });
        if (!updater) throw new Error("Can't import Aloes Handlers");
        if (debug) {
            console.log("updateInstance value type: ", typeof msg.payload);
        }
        const sensor = updater(msg.sensor, Number(msg.resource), msg.payload);
        // const sensor = msg.sensor;
        if (!sensor || sensor === null ) throw new Error("Error while updating sensor");
        if (debug) {
            console.log("updateInstance : ", sensor.name, sensor.resource);
        }
        sensor.resource = Number(msg.resource);
        sensor.method = msg.method;
        sensor.lastSignal = new Date();
        sensor.value = msg.payload;
        msg.payload = sensor;
        global.set(msg.storeKey, sensor, storeType, (err) => {
            if(err) throw err;
        });  
        if (debug) console.log("updateInstance:res ", sensor.name, sensor.value);
        if (debug) return [msg, msg];
        return [msg,null];
        //  return msg;
    }
    throw new Error(`${msg.deviceName} - no sensor instance`);
} catch(error){
    if (debug) console.log("updateInstance:err ", error);
    return null;
    // throw error;
}
