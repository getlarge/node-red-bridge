// name: measurements-to-chart
// outputs: 1
const series = [];
const measurements = msg.measurement;
const chartData = {};

measurements.forEach(measurement => {
    const serie = `${measurement.type}-${measurement.nativeSensorId}-${measurement.resource}`;
    const foundSerie = series.some(s => s === serie);
    if (!foundSerie) {
        series.push(serie);
        chartData[serie] = [];
    }
    return chartData[serie].push({x: new Date(measurement.time).getTime(), y: measurement.value });
})
//  console.log("measurement data: ", chartData);

msg.payload = [{
    series,
    data: [],
    labels: [""]
}];
// console.log("chart series : ", msg.payload[0].series);
const data = Array.from(Array(series.length), () => new Array(1));
//  console.log("array of data: ", data);
series.forEach((key,index) => data[index] = chartData[key]);
msg.payload[0].data = data;
// console.log("chart data: ", msg.payload[0].data);
return msg;