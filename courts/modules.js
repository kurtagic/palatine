const { ChannelType } = require("discord.js");
const { courtsCategoryName, createCourtChannelName, hostPermissions } = require("./config.json");

module.exports = {
    initialise: async function (guild) {
        let courts = await module.exports.getCourtsCategory(guild);
        if (!courts) {
            courts = await guild.channels.create({
                name: courtsCategoryName,
                type: ChannelType.GuildCategory,
            });
        }

        let createCourt = await module.exports.getCreateCourtChannel(guild);

        if (!createCourt) {
            createCourt = await guild.channels.create({
                name: createCourtChannelName,
                parent: courts.id,
                type: ChannelType.GuildVoice,
            });
        }

        return { courts, createCourt };
    },

    createCourt: async function (member, name) {
        const courtsCategory = await module.exports.getCourtsCategory(member.guild);
        const court = await member.guild.channels.create({
            name: name,
            parent: courtsCategory.id,
            type: ChannelType.GuildVoice,
            permissionOverwrites: [
                {
                    id: member.id,
                    allow: hostPermissions,
                },
            ],
        });

        return court;
    },

    getCourtsCategory: function (guild) {
        return guild.channels.cache.find((channel) => {
            return channel.type === ChannelType.GuildCategory && channel.name === courtsCategoryName;
        });
    },

    getCreateCourtChannel: function (guild) {
        return guild.channels.cache.find((channel) => {
            return channel.type === ChannelType.GuildVoice && channel.name === createCourtChannelName;
        });
    },

    getCourtChannel: async function (member) {
        const courtsCategory = await module.exports.getCourtsCategory(member.guild);
        if (!courtsCategory) {
            return null;
        }

        return member.guild.channels.cache.find((channel) => {
            return channel.type === ChannelType.GuildVoice &&
                channel.parentId === courtsCategory.id &&
                channel.permissionOverwrites.resolve(member.id) &&
                channel.permissionOverwrites.resolve(member.id).allow.has(hostPermissions, true);
        });
    },

    getCourts: async function (guild) {
        const courtsCategory = await module.exports.getCourtsCategory(guild);
        if (!courtsCategory) {
            return [];
        }

        return guild.channels.cache.filter((channel) => {
            return channel.type === ChannelType.GuildVoice &&
                channel.parentId === courtsCategory.id &&
                channel.name !== createCourtChannelName;
        });
    },

    getCourtHost: async function (channel) {
        const members = await channel.guild.members.fetch();
        for (const member of members.values()) {
            const overwrite = channel.permissionOverwrites.resolve(member.id);
            if (overwrite && overwrite.allow.has(hostPermissions, true)) {
                return member;
            }
        }

        return null;
    },

    getCourtGuests: async function (channel) {
        const host = await module.exports.getCourtHost(channel);
        return channel.members.filter((participant) => participant !== host);
    },

    shouldCourtBeDeleted: function (channel) {
        return (
            channel &&
            channel.parent &&
            channel.parent.name === courtsCategoryName &&
            channel.name !== createCourtChannelName &&
            channel.members.size === 0
        );
    },

    isInCreateCourt: function (channel) {
        return channel && channel.name === createCourtChannelName;
    },
};
