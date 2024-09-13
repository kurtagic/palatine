const {Events} = require('discord.js');
const {deleteDelay, defaultCourtName} = require("../courts/courts_config.json");
const {getCourtChannel, shouldCourtBeDeleted, createCourt, isInCreateCourt} = require("../courts/utils");

// if newState && !oldState ... joined channel
// if !newSate && oldSate ... left channel
// if newState && oldState && newState.channel.id !== oldState.channel.id ... moved channels
// else ... stayed in channel

module.exports = {
    name: Events.VoiceStateUpdate, once: false, async execute(oldState, newState) {
        if (isInCreateCourt(newState.channel)) {
            await moveToCourt(newState.member);
        }

        if (shouldCourtBeDeleted(oldState.channel)) {
            await handleCourtDeletion(oldState.channel);
        }
    },
};

async function moveToCourt(member) {
    let court = await getCourtChannel(member);

    if (!court) {
        const name = member.nickname || member.user.globalName || member.user.username;
        const courtName = defaultCourtName.replace("{user}", name);
        court = await createCourt(member, courtName);
    }

    await member.voice.setChannel(court);
}

async function handleCourtDeletion(court) {
    const deleteTimestamp = Date.now() + deleteDelay;
    const intervalTime = deleteDelay / 10;

    const interval = setInterval(async () => {
        // get current channel status (incase it got updated)
        const channel = court.guild.channels.cache.get(court.id);

        if (!channel || channel.members.size > 0) {
            clearInterval(interval);
            return;
        }

        if (Date.now() >= deleteTimestamp) {
            await channel.delete();
            clearInterval(interval);
        }
    }, intervalTime);
}