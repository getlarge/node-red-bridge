// name: print-debug
// outputs: 2
try {
    if (env.get("print_debug")) {
        const d = new Date();
        const filename = './log/game.log';
        let payload;
        if (msg.sensor) {
            payload = `${d.toLocaleString()}-update sensor-${msg.deviceName}-${msg.sensor.nativeSensorId}-${msg.sensor.resource}`;
            delete msg.sensor;
        } else  if (msg.device) {
            payload = `${d.toLocaleString()}-update device-${msg.deviceName}`;
            delete msg.device;
        }
        const message = {payload, filename};
        console.log("print debug : ", message);
        delete msg.deviceName;
        delete msg.collection
        return [msg, message];
    }
    if (msg.sensor) {
        delete msg.sensor;
    } else  if (msg.device) {
        delete msg.device;
    }
    // delete msg.deviceName;
    return msg;
} catch(error) {
    return null;
}
