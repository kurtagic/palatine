const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const {color, footer} = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("get latency"),

    async execute(interaction) {
        const sent = await interaction.reply({
            content: "Pinging...", fetchReply: true,
        });

        const roundtripLatency = sent.createdTimestamp - interaction.createdTimestamp;
        const websocketHeartbeat = interaction.client.ws.ping;

        const embed = new EmbedBuilder()
            .setTitle("PING111")
            .setDescription(`Roundtrip latency: **${roundtripLatency}**ms\nWebsocket heartbeat: **${websocketHeartbeat}**ms`)
            .setThumbnail(interaction.client.user.avatarURL())
            .setFooter({text: footer})
            .setTimestamp()
            .setColor(color);

        interaction.editReply({embeds: [embed]});
    },
};