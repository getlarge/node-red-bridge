// name: dispatch-message
// outputs: 6
const debug = env.get("debug");
try {
    if (!msg.topic) throw new Error("no msg.topic");
    if (!msg.parts) {
        msg.parts = msg.topic.split("/");
    }
    if (msg.device && msg.device !== null) {
        if (debug) {
            const message = {topic: msg.topic, payload : msg.device};
            return [msg, null, null, null, null, message];
        }
        return [msg, null, null, null,null, null];
    } else if (msg.sensor && msg.sensor !== null) {
        if (debug) {
            const message = {topic: msg.topic, payload : msg.sensor};
            return [null, msg, null, null, null, message];
        }
        return [null, msg, null, null, null, null];
    } else if (msg.measurement && msg.measurement !== null) {
        if (debug) {
            const message = {topic: msg.topic, payload : msg.measurement};
            return [null, null, msg, null, null, message];
        }
        return [null, null, msg, null, null, null];
    } else if (msg.status && msg.status !== null) {
        if (debug) {
            const message = {topic: msg.topic, payload : msg.status};
            return [null, null, null, msg, null, message];
        }
        return [null, null,null, msg, null, null];
    } else if (msg.trigger && msg.trigger !== null) {
        if (debug) {
            // const message = {topic: msg.topic, payload : msg.trigger};
            return [null, null, null, null, msg, null];
        }
        return [null, null, null, null, msg, null];
    }
    return [null,null, null, null, null, null];
} catch(error){
    if (debug) {
        console.log('dispatch-message error', error.message);
    }
    return [null,null, null, null, null, null];
}