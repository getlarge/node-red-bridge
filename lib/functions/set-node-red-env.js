// name: set-node-red-env
// outputs: 2
const storeType = env.get("store_type") || "memoryOnly";
const processEnv = global.get("processEnv", storeType);
if (!processEnv) throw new Error("process.env unavailable");
const nodeRedUrl = flow.get("nodeRedUrl")
if (nodeRedUrl) {
    processEnv.NODE_RED_URL = nodeRedUrl;
}  
const nodeRedPort = flow.get("nodeRedPort")
if (nodeRedPort) {
    processEnv.NODE_RED_PORT = nodeRedPort;
}
const nodeRedHost = flow.get("nodeRedHost")
if (nodeRedHost) {
    processEnv.NODE_RED_HOST = nodeRedHost;
}  
const nodeRedAdminRoot = flow.get("nodeRedAdminRoot")
if (nodeRedAdminRoot) {
    processEnv.NODE_RED_ADMIN_ROOT = nodeRedAdminRoot;
} 
const nodeRedApiRoot = flow.get("nodeRedApiRoot")
if (nodeRedApiRoot) {
    processEnv.NODE_RED_API_ROOT = nodeRedApiRoot;
}
const nodeRedUsername = flow.get("nodeRedUsername")
if (nodeRedUsername) {
    processEnv.NODE_RED_USERNAME = nodeRedUsername;
}
const nodeRedPassword = flow.get("nodeRedPassword")
if (nodeRedPassword) {
    processEnv.NODE_RED_USERPASS = nodeRedPassword;
}
const tunnelUrl = flow.get("tunnelUrl")
if (tunnelUrl) {
    processEnv.TUNNEL_URL = tunnelUrl;
}
if (env.get("debug")) {
    return [msg,msg];
}
return [msg,null];

