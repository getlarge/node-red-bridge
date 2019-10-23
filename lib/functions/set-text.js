// name: set-text
// outputs: 1
const debug = env.get("debug");
try {
    if (!msg || msg === null || !msg.sensor) throw new Error("No input to parse");
    const resourceId = env.get("resource_id");
    if (!resourceId) throw new Error("no resource id set")
    const value = msg.sensor.resources[resourceId];
    if (!value) throw new Error("no sensor value found")
    if (debug) console.log(`get-text for ${resourceId} :`, value)
    
    if (typeof value === "string") {
        msg.payload = value; 
    } else if (typeof value === "number") {
        msg.payload = value.toString();
    } else if (typeof value === "boolean") {
        msg.payload = value.toString();
    } else if (typeof value === "object" && value.type && value.data){
        const bufferOriginal = Buffer.from(value.data);
        msg.payload = bufferOriginal.toString('utf-8');
        //  msg.payload = JSON.parse(msg.payload);
    } else if (Buffer.isBuffer(value)){
        msg.payload = value.toString('utf-8');
    } else if (value instanceof Array) {
        msg.payload = Buffer.from(value).toString('utf-8');
    } else {
        throw new Error("No value found");
    }
    if (debug) console.log(`set-text for ${resourceId} : ${msg.payload}`)
    return msg;
} catch(error) {
    if (debug) console.log(`set-text:err`, error);
    return null;
}