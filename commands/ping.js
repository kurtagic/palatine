const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { color, footer } = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("get latency"),

    async execute(interaction) {
        const sent = await interaction.reply({
            content: "Pinging...",
            fetchReply: true,
        });

        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const heartbeat = interaction.client.ws.ping;

        const embed = new EmbedBuilder()
            .setTitle("PING")
            .setDescription(`Roundtrip latency: **${latency}**ms\nWebsocket heartbeat: **${heartbeat}**ms`)
            .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: footer, iconURL: interaction.client.user.avatarURL() })
            .setTimestamp()
            .setColor(color);

        interaction.editReply({ embeds: [embed] });
    },
};
