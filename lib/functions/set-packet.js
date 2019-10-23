// name: set-packet
// outputs: 2
try {
    if (!msg.topic || msg.topic === null) throw new Error("no topic to send message");
    msg.parts = msg.topic.split("/");
    const userId = env.get("ALOES_USER_ID");
    if (!userId || msg.parts[0] !== userId) throw new Error("Invalid userId");
    const qos = env.get("qos") || "0";
    const retain = env.get("retain") || "false";
    msg.qos = Number(qos);
    msg.retain = Boolean(retain);
    if (env.get("debug")) {
        console.log("aloes-client-out", msg.topic);
        return [msg,msg];
    }
    return [msg,null];
} catch(error) {
    if (env.get("debug")) console.log("Aloes client tx:err", error);
//     throw error;
    return null;
}
