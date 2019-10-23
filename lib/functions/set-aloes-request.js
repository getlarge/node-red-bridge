// name: set-aloes-request
// outputs: 1
try {
    const token = env.get('aloes_token');
    const path = env.get('path');
    msg.contentType = env.get("content_type") || "application/json";
    msg.method = env.get("method") || 'GET';
    msg.headers = {};
    msg.headers['Authorization'] = token;
    msg.headers['Accept'] = `${msg.contentType}, text/plain`;
    msg.headers['Content-Type'] = msg.contentType;
    msg.headers['x-access-token'] = token;
    //  msg.headers['Origin'] = 'http://localhost:8000';
    //  msg.headers['Connection'] = 'keep-alive';
    let protocol = 'http';
    if (env.get('aloes_http_secure') === 'true') {
        protocol = 'https';
    }
    const collection = env.get('collection') || 'Devices';
    const aloesApiRoot = env.get('aloes_http_api_root') || '/api';
    msg.baseUrl = `${protocol}://${env.get('aloes_http_host')}:${env.get('aloes_http_port')}${aloesApiRoot}`;
    msg.url = `${msg.baseUrl}/${collection}`;
    if (path) {
        msg.url = `${msg.url}/${path}`;
    }
    if (msg.filter) {
        //  msg.url = `${msg.url}?filter=${JSON.stringify(msg.filter).toString()}`;
        msg.url = `${msg.url}?filter=${msg.filter}`;
    }
    return msg; 
} catch(error) {
    throw error;
}
