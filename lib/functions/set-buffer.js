// name: set-buffer
// outputs: 1
const debug = env.get("debug");
try {
    if (!msg || msg === null || !msg.sensor) throw new Error("No input to parse");
    const resourceId = env.get("resource_id");
    if (!resourceId) throw new Error("no resource id set");
    const value = msg.sensor.resources[resourceId];
    if (!value) return null;
    // if (!value) throw new Error("no sensor value found");
    if (debug) console.log(`get-buffer for ${resourceId}`, typeof value);

    if (typeof value === "string") {
        if ( value === "1" ||  value === "true") return null;
        else if (value === "false" || value === "0") {
            msg.reset = true;
            return msg;
        }    
        try {
            msg.payload = JSON.parse(value).data;
        } catch(e) {
            msg.payload = Buffer.from(value, 'utf-8').toJSON().data; 
        }
        //  msg.payload = Buffer.from(value, 'utf-8').toJSON(); 
    } else if (typeof value === "object" && value.type && value.data){
        msg.payload = value.data;
    } else if (Buffer.isBuffer(value)){
        msg.payload = value;
    }
    const type = env.get("content_type");
    if (type && type !== null) {
        msg.mimetype = type; 
    }
    msg.payload = Buffer.from(msg.payload);
    if (debug) console.log(`set-buffer for ${resourceId}`, Buffer.isBuffer(msg.payload));
    return msg;
} catch(error) {
    if (debug) console.log(`set-buffer :err`, error);
    return null;
}