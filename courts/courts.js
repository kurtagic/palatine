const {ChannelType} = require("discord.js");
const {courtsCategoryName, hostPermissions} = require("./courts_config.json");

module.exports = {
    getCourtsCategory: function (guild) {
        return guild.channels.cache.find(channel => channel.type === ChannelType.GuildCategory && channel.name === courtsCategoryName);
    },

    getCourtChannel: async function (member) {
        const courtsCategory = await module.exports.getCourtsCategory(member.guild);
        return member.guild.channels.cache.find(channel => channel.type === ChannelType.GuildVoice && channel.parentId === courtsCategory.id && channel.permissionOverwrites.resolve(member.id)?.allow.has(hostPermissions, true));
    },

    getCourtHost: function (court) {
        for (const member of court.guild.members.cache.values()) {
            const overwrite = court.permissionOverwrites.resolve(member.id);

            if (overwrite && overwrite.allow.has(hostPermissions, true)) {
                return member;
            }
        }

        return null;
    },

    getCourtGuests: async function(court) {
        const host = await module.exports.getCourtHost(court);
        return court.members.filter(participant => participant !== host);
    }
};