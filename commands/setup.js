const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { color, footer } = require("../config.json");
const { initialise } = require("../courts/modules.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("inital setup")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const channels = await initialise(interaction.guild);
        const embed = new EmbedBuilder()
            .setTitle("INITAL SETUP")
            .setDescription(`The setup is complete! The ${channels.courts.url} category and ${channels.createCourt.url} have been setup. do not edit them manually because that will break everything. Just leave them to the bot please and thank you.\n\nmore info: \`/help\``)
            .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: footer, iconURL: interaction.client.user.avatarURL() })
            .setTimestamp()
            .setColor(color);

        interaction.reply({ embeds: [embed] });
    },
};
