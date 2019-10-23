// name: set-query
// outputs: 1
try {
    const userId = env.get("ALOES_USER_ID");
    const filter = JSON.stringify({
          where: {ownerId: userId},
          include: 'sensors',
          limit: 50,
        });
    msg.filter = filter;
    //  msg.payload = {filter};
    return msg;
} catch(error) {
    return error;
}