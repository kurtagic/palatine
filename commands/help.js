const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { color, footer } = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("more info"),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("HELP")
            .setDescription("`/setup` - admin only\n`/ping` - view latency\n`/court [user]` - view court\n`/courts` - view all courts in server\n\n [] = optional")
            .setThumbnail(interaction.client.user.avatarURL())
            .setFooter({ text: footer })
            .setTimestamp()
            .setColor(color);

        interaction.reply({ embeds: [embed] });
    },
};
