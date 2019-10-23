// name: compose-sensor
// outputs: 1
const debug = env.get("debug");
const deviceName = env.get("device_name");
let objectId = env.get("object_id");
let nativeNodeId = env.get("node_id");
let nativeSensorId = env.get("sensor_id");
let resourceId = env.get("resource_id");
const storeType = env.get("store_type");
const omaObjects = msg.omaObjects;
const omaViews = msg.omaViews;
if (!deviceName || !objectId) throw new Error("Missing arguments");
if (!omaObjects || !omaObjects ) throw new Error("Missing references");

function getDevice(deviceName) {
    return ;
}

function sensorFactory(device, attributes) {
    if (debug) console.log("sensorFactory:", device.id, attributes);
    if (!device) return null;
    // const omaObject = omaObjects[Math.floor(Math.random() * omaObjects.length)];
    const objectId = attributes.objectId;
    const nodeId = attributes.nodeId || "0";
    const sensorId = attributes.sensorId || "1";
    const omaObject = omaObjects.find(object => object.id === objectId);
    const resourceKeys = Object.keys(omaObject.resources);
    const omaView = omaViews.find(view => view.id === omaObject.id);
    const resourceId = attributes.resourceId || resourceKeys[Math.floor(Math.random() * resourceKeys.length)];

    return {
        name: omaObject.name,
        type: omaObject.id,
        resource: resourceId,
        resources: omaObject.resources,
        frameCounter: 0,
        method: 'HEAD',
        value: "creation",
        inPrefix: '-in',
        outPrefix: '-out',
        lastSignal: new Date(),
        icons: omaView.icons,
        colors: omaView.resources,
        nativeSensorId,
        nativeNodeId,
        nativeType: omaObject.id,
        ownerId: device.ownerId,
        devEui: device.devEui,
        transportProtocol: device.transportProtocol,
        messageProtocol: device.messageProtocol,
        deviceId: device.id,
    };
}

try {
    if (msg.topic) {
        const t = msg.topic.split('/')
        // const method = t[0];
        // const collection = t[1].toLowerCase();
        objectId = Number(t[2]) || objectId;
        nativeNodeId = t[3] || nativeNodeId;
        nativeSensorId = t[4] || nativeSensorId;
        resourceId = Number(t[5]) || resourceId;
        // const collectionName = `${collection.charAt(0).toUpperCase()}${collection.slice(1)}`;
    }
    if (debug) console.log("getDevice:", deviceName);
    global.get(`device-${deviceName}`, storeType, (err, device) => {
        if (err) throw err;
        msg.sensor = sensorFactory(device, {objectId, nativeNodeId, nativeSensorId, resourceId});
        if (debug) console.log("compose-sensor:res", msg.sensor);
        if (msg.sensor) {
            msg.topic = `${msg.sensor.ownerId}/Sensor/HEAD`;
            delete msg.omaObjects;
            delete msg.omaViews;
            msg.payload = msg.sensor;
            node.send(msg);
        }
       
    });
    
} catch(error) {
    // throw error;
    return null;
}

