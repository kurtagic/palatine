const {Events, ActivityType, PresenceUpdateStatus} = require("discord.js");
const {iconURL} = require("../config.json");

module.exports = {
    name: Events.ClientReady, once: true, execute(client) {

        // client.user.setUsername(client.user.username);
        // client.user.setAvatar(client.user.avatarURL());
        client.user.setPresence({
            activities: [{name: 'over the realm', type: ActivityType.Watching}], status: PresenceUpdateStatus.Idle
        });

        console.log(`launched ${client.user.tag}`);
    },
};