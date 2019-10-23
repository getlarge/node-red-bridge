// name: set-internal-request
// outputs: 1
try {
    const host = env.get("node_red_host");
    const port = env.get("node_red_port");
    const apiRoot = env.get("node_red_api_root");
    const url = env.get("node_red_url");
    const token = env.get("node_red_admin_passhash");
    //  console.log("token", token)
    //  msg.url = `http://${host}:${port}/${apiRoot}/start`;
    if (!token) throw new Error("No token retrieved");
    let reqUrl;
    //  console.log("payload", msg.payload)
    if (msg.payload.requestUrl) {
        reqUrl = msg.payload.requestUrl;
    } else {
        reqUrl = "start";
    }
    let method;
    if (msg.payload.method) {
        method = msg.payload.method;
    } else {
        method = "GET";
    }
    msg.url = `${url}/${reqUrl}`;
    msg.method = method;
    msg.headers = {};
    msg.headers['Authorization'] = token;
    msg.headers['Accept'] = "application/json";
    msg.headers['Content-Type'] = "application/json";
    msg.headers['x-access-token'] = token;
    console.log("url", msg.url)
    console.log("headers", msg.headers)

    if (msg.payload.query) {
        //  msg.body = msg.payload.query;
        const query = JSON.stringify(msg.payload.query);
        msg.payload = query;
        console.log("payload", msg.payload)
    } else {
        msg.payload = {token, userId: 'test'};
    }
    //  msg.query = {filter};
    return msg;
} catch(error) {
    return null;
}