// name: set-float
// outputs: 1
const debug = env.get("debug");
try {
    if (!msg || msg === null || !msg.sensor) throw new Error("No input to parse");
    const resourceId = env.get("resource_id");
    if (!resourceId) throw new Error("no resource id set")
    let value = msg.sensor.resources[resourceId];
    //  const value = msg.sensor.value;
    if (value === undefined || value === null) throw new Error("no sensor value found")
    if (debug) {
        console.log(`get-float for ${resourceId} :`, typeof value, value)
    }
    if (typeof value === "object" && value.type && value.data){
        value = Buffer.from(value).toString('utf-8');
    } else if (Buffer.isBuffer(value)){
        value = value.toString('utf-8');
    } else if (value instanceof Array) {
        value = Buffer.from(value).toString('utf-8');
    }
    if (typeof value === "string") {
        if (value === "1" || value === "true") {
            msg.payload = 1;
        } else if (value === "0" || value === "false") {
            msg.payload = 0;
        } else {
            msg.payload = Number(value); 
        }
    } else if (typeof value === "number") {
        msg.payload = value;
    } else if (typeof value === "boolean") {
        if (value === true) {
            msg.payload = 1;
        } else if (value === false) {
            msg.payload = 0;
        } 
    } else throw new Error("no valid payload to parse");
    
    if (msg.payload === undefined) throw new Error("no payload");
    const precision = env.get("precision") || msg.sensor.resources["5701"] || null;
    const unit = env.get("unit");
    if (unit && unit !== null) {
        msg.unit = unit;
    }
    //msg.payload = Number(msg.payload);
    //if (precision && precision !== null) {
    //    msg.payload = msg.payload.toPrecision(precision)
    //}
    if (debug) console.log(`set-float for ${resourceId} : ${msg.payload}`)
    return msg;
} catch(error) {
    if (debug) console.log(`set-float :err`, error);
    return null;
}