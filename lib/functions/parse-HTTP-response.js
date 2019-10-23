// name: parse-HTTP-response
// outputs: 2
try {
    if (msg.statusCode && msg.statusCode === 200) {
        node.status({fill:"green",shape:"ring",text:"success"});
        return [msg,null];
    }
    node.status({fill:"red",shape:"ring",text:"error"});
    return [null,msg];
} catch(error) {
    return null;
}
