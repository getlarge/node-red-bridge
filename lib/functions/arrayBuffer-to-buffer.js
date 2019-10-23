// name: arrayBuffer-to-buffer
// outputs: 1
function toBuffer(ab) {
    const buf = Buffer.alloc(ab.byteLength);
    const view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}

if (msg.payload) {
    // console.log("typeof payload", typeof msg.payload);
    msg.payload = toBuffer(msg.payload);
    // console.log("Buffer:res", msg.payload);
    return msg;
}
return null;
