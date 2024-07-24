const {Events, ChannelType} = require("discord.js");

const ck3CreateCourtChannelID = "1265445785085018123";
const ck3CourtsCategoryID = "1265479048889634988";

module.exports = {
    name: Events.VoiceStateUpdate, once: false, async execute(oldState, newState) {

        // CK3 COURTS
        if (newState.channelId === ck3CreateCourtChannelID) await handleCourtChannel(newState.member, newState.guild);
        if (oldState.channel && oldState.channel.parentId === ck3CourtsCategoryID && oldState.channel.members.size === 0) await oldState.channel.delete();

    },
};

async function handleCourtChannel(member, guild) {
    const name = member.nickname || member.user.globalName || member.user.username;
    const userCourtChannelName = `${name}'s court`;
    const existingChannel = guild.channels.cache.find(channel => channel.parentId === ck3CourtsCategoryID && channel.name === userCourtChannelName && channel.type === ChannelType.GuildVoice);

    if (existingChannel) {
        await existingChannel.delete();
        await member.voice.disconnect();

        return;
    }

    const newChannel = await guild.channels.create({
        name: userCourtChannelName,
        type: ChannelType.GuildVoice,
        parent: ck3CourtsCategoryID,
    });

    await member.voice.setChannel(newChannel);
}
