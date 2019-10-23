// name: update-client-status
// outputs: 1
try {
    const storeType = "file";
    let status = false;
    if (msg.status && msg.status.text && msg.status.text.startsWith("node-red:common.status.")) {
        if (msg.status.text.endsWith("disconnected")) {
            status = false;
        } else if (msg.status.text.endsWith("connected")) {
            status = true;
        } 
    }
    const storeKey = `aloesClientStatus`;
    let prevConnStatus;
    global.get(storeKey, storeType, (err, res) => {
        if(err) throw err;
        prevConnStatus = res
    });
    
    if (!status || status !== prevConnStatus) {
        // change Client Id
        const userId = env.get("ALOES_USER_ID");
        const clientId = `${userId}-${Math.random().toString(16).substr(2, 8)}`;
        flow.set("client-id", clientId);
        const processEnv = global.get("processEnv");
        if (processEnv) processEnv.ALOES_CLIENT_ID = clientId;
    } else {
        const clientId = flow.get("client-id") || `${env.get("ALOES_USER_ID")}-${Math.random().toString(16).substr(2, 8)}`;
        const processEnv = global.get("processEnv");
        if (processEnv) processEnv.ALOES_CLIENT_ID = clientId;
    }
    
    global.set(storeKey, status, storeType, (err) => {
        if(err) throw err;
    });
    return msg;
} catch(error){
    //  console.log('error', error);
    return null;
}
