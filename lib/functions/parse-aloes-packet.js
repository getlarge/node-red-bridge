// name: parse-aloes-packet
// outputs: 2
if (!msg.topic) return [null,null];
const debug = env.get("debug");
msg.parts = msg.topic.split("/");
try {
    if (debug) console.log("MQTT payload type, before", typeof msg.payload);  
    if (typeof msg.payload === "string") {
        msg.payload = JSON.parse(msg.payload);
    } else if (typeof msg.payload === "object") {
        if (Buffer.isBuffer(msg.payload)) {
            msg.payload = JSON.parse(msg.payload.toString());
        }
    }
} catch(error) {
    return [null,null];
}
if (debug) console.log("MQTT payload type, after", typeof msg.payload);  

// check that msg.parts[0] === env.get("MQTT_BROKER_USER")
if (env.get("debug")) {
    return [msg,msg];
}
return [msg,null];
