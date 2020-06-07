// name: set-aloes-packet
// outputs: 2
try {
    if (!msg.topic) throw new Error("no topic to send message");
    msg.parts = msg.topic.split("/");
    const userId = env.get("ALOES_USER_ID");
    if (!userId || msg.parts[0] !== userId) throw new Error("Invalid userId");
    const qos = env.get("qos") || "0";
    const retain = env.get("retain") || "false";
    msg.qos = Number(qos);
    msg.retain = Boolean(retain);
    if (env.get("debug")) {
        console.log("set-aloes-packet", msg.topic);
        return [msg,msg];
    }
    return [msg,null];
} catch(error) {
    if (env.get("debug")) console.log("set-aloes-packet error", error.message);
    return [null, null];
}
