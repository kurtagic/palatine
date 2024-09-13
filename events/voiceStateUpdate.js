const {Events, ChannelType} = require('discord.js');
const {courtsCategoryName, createCourtChannelName, deleteDelay, hostPermissions} = require("../courts/courts_config.json");
const {getCourtChannel, getCourtsCategory} = require("../courts/courts");

// if newState && !oldState ... joined channel
// if !newSate && oldSate ... left channel
// if newState && oldState && newState.channel.id !== oldState.channel.id ... moved channels
// else ... stayed in channel

module.exports = {
    name: Events.VoiceStateUpdate, once: false, async execute(oldState, newState) {
        if (newState.channel && newState.channel.name === createCourtChannelName) {
            await createOrMoveToCourt(newState.member, newState.guild);
        }

        if (shouldCourtBeDeleted(oldState)) {
            await handleCourtDeletion(oldState);
        }
    },
};

async function createOrMoveToCourt(member, guild) {
    const name = member.nickname || member.user.globalName || member.user.username;
    const courtName = `${name}'s court`;

    const courtsCategory = await getCourtsCategory(guild);
    let court = await getCourtChannel(member);

    if (!court) {
        court = await guild.channels.create({
            name: courtName, parent: courtsCategory.id, type: ChannelType.GuildVoice, permissionOverwrites: [{
                id: member.id, allow: hostPermissions
            }]
        });
    }

    await member.voice.setChannel(court);
}

function shouldCourtBeDeleted(oldState) {
    return oldState.channel &&  oldState.channel.parent && oldState.channel.parent.name === courtsCategoryName &&
        oldState.channel.name !== createCourtChannelName &&
        oldState.channel.members.size === 0;
}

async function handleCourtDeletion(oldState) {
    const courtId = oldState.channel.id;
    const deleteTimestamp = Date.now() + deleteDelay;
    const intervalTime = 5*1000;

    const interval = setInterval(async () => {
        const channel = oldState.guild.channels.cache.get(courtId);
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