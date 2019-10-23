// name: set-array-buffer
// outputs: 1
const debug = env.get("debug");
try {
    const resourceId = env.get("resource_id");
    if (!resourceId) throw new Error("no resource id set");
    const value = msg.sensor.resources[resourceId];    //  const value = msg.sensor.value;
    if (!value) throw new Error("no sensor value found");
    if (debug) {
        console.log("get array buffer from type :", value, typeof value);
    }
    if (typeof value === "string") {
        if ( value === "1" ||  value === "true") return null;
        msg.payload = Buffer.from(value, 'base64').toJSON().data; 
        if (debug) console.log("set array buffer from string:",  msg.payload);

    } else if (typeof value === "object" && value.type && value.data){
        //  msg.payload = value.data;
        msg.payload = Buffer.from(value);
        msg.payload = msg.payload.toString('utf-8');
    } else if (Buffer.isBuffer(value)){
        msg.payload = value;
    } else {
        return null;
    }
    if (debug) console.log("set array buffer :", msg.payload);
    return msg;
} catch(error) {
    if (debug) console.log(`set-array-buffer:err`, error);
    return null;
}