// name: set-chart-topic
// outputs: 1
msg.topic = `${msg.measurement.type}-${msg.measurement.nativeSensorId}-${msg.measurement.resource}`;
msg.payload = msg.measurement.value;
return msg;
