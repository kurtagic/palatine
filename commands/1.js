const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const {color, footer} = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("1")
        .setDescription("embed message")
        .addStringOption(option => option
            .setName("content")
            .setDescription("message content")
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setDescription(interaction.options.getString("content"))
            .setThumbnail(interaction.user.displayAvatarURL(interaction.user.avatar))
            .setFooter({text: footer, iconURL: interaction.client.user.avatarURL()})
            .setTimestamp()
            .setColor(color)

        interaction.reply({embeds: [embed]});
    },
};