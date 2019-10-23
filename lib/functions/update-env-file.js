// name: update-env-file
// outputs: 1
try {
    const storeType = env.get("store_type") || "memory";
    const processEnv = global.get("processEnv", storeType);
    if (!processEnv) throw new Error("process.env not available");
    if (!processEnv.NODE_ENV) {
        msg.filename = "./.env";
    } else {
        msg.filename = `./deploy/.env_${processEnv.NODE_ENV}`;
    }
    msg.payload = `NODE_ENV=${env.get("NODE_ENV")}
NODE_NAME=${env.get("NODE_NAME")}
NODE_RED_URL=${env.get("NODE_RED_URL")}
NODE_RED_HOST=${env.get("NODE_RED_HOST")}
NODE_RED_PORT=${env.get("NODE_RED_PORT")}
NODE_RED_ADMIN_ROOT=${env.get("NODE_RED_ADMIN_ROOT")}
NODE_RED_API_ROOT=${env.get("NODE_RED_API_ROOT")}
NODE_RED_UI_PATH=${env.get("NODE_RED_UI_PATH")}
NODE_RED_USER_DIR=${env.get("NODE_RED_USER_DIR")}
NODE_RED_USERNAME=${env.get("NODE_RED_USERNAME")}
NODE_RED_USERPASS=${env.get("NODE_RED_USERPASS")}
NODE_RED_PASSHASH=${env.get("NODE_RED_PASSHASH")}
NODE_RED_ADMIN_PASSHASH=${env.get("NODE_RED_ADMIN_PASSHASH")}
NODE_RED_SESSION_SECRET=${env.get("NODE_RED_SESSION_SECRET")}
NODE_RED_CREDENTIAL_SECRET=${env.get("NODE_RED_CREDENTIAL_SECRET")}
NODE_RED_STORE_TYPE=${env.get("NODE_RED_STORE_TYPE")}
ALOES_HTTP_HOST=${env.get("ALOES_HTTP_HOST")}
ALOES_HTTP_PORT=${env.get("ALOES_HTTP_PORT")}
ALOES_HTTP_API_ROOT=${env.get("ALOES_HTTP_API_ROOT")}
ALOES_HTTP_SECURE=${env.get("ALOES_HTTP_SECURE")}
ALOES_MQTT_HOST=${env.get("ALOES_MQTT_HOST")}
ALOES_MQTT_PORT=${env.get("ALOES_MQTT_PORT")}
ALOES_MQTT_SECURE=${env.get("ALOES_MQTT_SECURE")}
ALOES_USER_ID=${env.get("ALOES_USER_ID")}
ALOES_USER_EMAIL=${env.get("ALOES_USER_EMAIL")}
ALOES_USER_PASSWORD=${env.get("ALOES_USER_PASSWORD")}
ALOES_TOKEN=${env.get("ALOES_TOKEN")}
ALOES_TOPIC_IN=${env.get("ALOES_TOPIC_IN")}
SERVER_LOGGER_LEVEL=${env.get("SERVER_LOGGER_LEVEL")}
TUNNEL_URL=${env.get("TUNNEL_URL")}
GIT_REPO_SSH_URL=${env.get("GIT_REPO_SSH_URL")}
VPS_HOST=${env.get("VPS_HOST")}
VPS_USER=${env.get("VPS_USER")}`
    return msg;
} catch(error) {
    return null;
}
