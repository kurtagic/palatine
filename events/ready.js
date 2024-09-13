const {Events, ActivityType, PresenceUpdateStatus} = require("discord.js");

module.exports = {
    name: Events.ClientReady, once: true, execute(client) {

        // client.user.setUsername(client.user.username);
        // client.user.setAvatar(client.user.avatarURL());
        client.user.setPresence({
            activities: [{name: "the Siren Song", type: ActivityType.Listening}], status: PresenceUpdateStatus.Idle
        });

        console.log(`launched ${client.user.tag}`);
    },
};