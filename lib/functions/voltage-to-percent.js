// name: voltage-to-percent
// outputs: 1
// converts volt to millivolt
// msg.payload = Number(msg.parts[5]) * 1000;
const debug = env.get("debug");
const maxVoltage = env.get("max_voltage");
const minVoltage = env.get("min_voltage");
if(!msg.payload) return null;
msg.payload = Number(msg.payload);
const mapValuetoRange = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;
msg.payload = mapValuetoRange(msg.payload, minVoltage, maxVoltage, 0, 100);
msg.payload = Number(msg.payload.toFixed(2));
if (debug) console.log("Converted voltage to percent", msg.payload);
return msg;    