const {ChannelType} = require("discord.js");
const {courtsCategoryName, createCourtChannelName, hostPermissions} = require("./courts_config.json");

module.exports = {
    initialise: async function (guild) {
        let courts = module.exports.getCourtsCategory(guild)
        if (!courts) {
            courts = guild.channels.create({
                name: courtsCategoryName, type: ChannelType.GuildCategory
            });
        }

        let createCourt = await guild.channels.cache.find(channel => channel.type === ChannelType.GuildVoice && channel.parentId === courts.id && channel.name === createCourtChannelName);
        if (!createCourt) {
            createCourt = await guild.channels.create({
                name: createCourtChannelName, parent: courts.id, type: ChannelType.GuildVoice
            });
        }

        return {courts, createCourt};
    },

    createCourt: async function (member, name) {
        const courtsCategory = await module.exports.getCourtsCategory(member.guild);
        const court = await member.guild.channels.create({
            name: name, parent: courtsCategory.id, type: ChannelType.GuildVoice, permissionOverwrites: [{
                id: member.id, allow: hostPermissions
            }]
        });

        return court;
    },

    getCourtsCategory: function (guild) {
        return guild.channels.cache.find(channel => channel.type === ChannelType.GuildCategory && channel.name === courtsCategoryName);
    },

    getCourtChannel: async function (member) {
        const courtsCategory = await module.exports.getCourtsCategory(member.guild);
        if (!courtsCategory) {
            return null;
        }
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

    getCourtGuests: async function (court) {
        const host = await module.exports.getCourtHost(court);
        if (!host) {
            return null;
        }
        return court.members.filter(participant => participant !== host);
    },

    shouldCourtBeDeleted: function (court) {
        return court && court.parent && court.parent.name === courtsCategoryName && court.name !== createCourtChannelName && court.members.size === 0;
    },

    isInCreateCourt: function(channel)
    {
        return channel && channel.name === createCourtChannelName;
    }

};