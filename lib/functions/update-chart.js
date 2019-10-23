// name: update-chart
// outputs: 1
const debug = env.get("debug");
try {
    // console.log("chartpoints req : ", msg.points);
    if (msg.points && msg.points !== null && msg.points[0]) {
        if (!msg.points[0].data || msg.points[0].data.length < 1) {
            // msg.points[0].data = Array.from(Array(msg.points[0].series), () => new Array(1));
            msg.points[0].data = [];
        }
        // msg.points[0].data = [];
        if (msg.topic && typeof msg.payload === 'number') {
            let index = msg.points[0].series.indexOf(msg.topic);
            if (index === -1) {
                index = msg.points[0].series.length;
                msg.points[0].series.push(msg.topic);
            }
            if (!msg.points[0].data[index] ) {
                msg.points[0].data[index] = [];
            }
            msg.points[0].data[index].push({x: new Date().getTime(), y: msg.payload});
            if (debug) console.log("filling array : : ",  points[0].data[index]);
            msg.points[0].data[index].sort((a,b) => b.x - a.x);
        } else if (msg.payload[0] && msg.payload[0].series) {
            if (debug) console.log("chartpoints batch : ", msg.payload[0].series);
            msg.payload[0].series.forEach((serie,i) => {
                let index = msg.points[0].series.indexOf(serie);
                if (debug) console.log(" batch serie index : ",serie, index);
                if (index === -1) {
                    index = msg.points[0].series.length;
                    msg.points[0].series.push(serie);
                } 
                if (debug) console.log("filling array : : ",  msg.points[0].data[index], 'with : ', msg.payload[0].data[i]);
                if (!msg.points[0].data[index] && msg.payload[0].data[i]) {
                    msg.points[0].data[index] = msg.payload[0].data[i];
                } else if (msg.payload[0].data[i]) {
                    msg.payload[0].data[i].forEach(point => msg.points[0].data[index].push(point));
                } else {
                    msg.points[0].data[index] = [];
                }
                msg.points[0].data[index].sort((a,b) => b.x - a.x);
            });
        }
    } else {
        if (msg.topic && typeof msg.payload === 'number') {
            msg.points = [{
                series: [msg.topic],
                data: [[{x: new Date().getTime(), y: msg.payload}]],
                labels: [""]
            }];
        } else if (msg.payload[0] && msg.payload[0].series) {
            if (debug) console.log("chartpoints batch : ", msg.payload[0].series);
            msg.points = [{
                series: msg.payload[0].series,
                data: msg.payload[0].data,
                labels: [""]
            }];
        }
    }
    // console.log("chartpoints res: ", msg.points[0].data);
    return msg;
} catch(error) {
    if (debug) console.log("update-chart:err", error);
    return null;
}