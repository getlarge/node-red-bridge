// name: Auth status
// outputs: 1
try {
    if (msg.auth && msg.auth !== null) {
        const storeType = "file";
        //  console.log("Auth status :", `${msg.auth}`);
        const storeKey = `aloesClientStatus`;
        global.set(storeKey, msg.auth, storeType, (err) => {
            if(err) throw err;
        });
        return msg;
    }
    throw new Error("No auth response");
} catch(error){
    //  console.log('error', error);
    return null;
}
