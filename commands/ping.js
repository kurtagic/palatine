const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const {color, footer, iconURL} = require("../config.json");
const {pingDatabase} = require("../utils/database.js");

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
        const databasePing = await pingDatabase();

        const embed = new EmbedBuilder()
            .setTitle("PING")
            .setDescription(`Roundtrip latency: **${roundtripLatency}**ms\nWebsocket heartbeat: **${websocketHeartbeat}**ms\nDatabase latency: **${databasePing}**ms`)
            .setThumbnail(iconURL)
            .setFooter({text: footer, iconURL: iconURL})
            .setTimestamp()
            .setColor(color);

        interaction.editReply({embeds: [embed]});
    },
};