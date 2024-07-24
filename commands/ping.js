const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const {color, footer, iconURL} = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("get latency"),

    async execute(interaction) {
        const sent = await interaction.reply({
            content: "Pinging...",
            fetchReply: true,
        });


        const embed = new EmbedBuilder()
            .setTitle("PING")
            .setDescription(`Roundtrip latency: **${sent.createdTimestamp - interaction.createdTimestamp}**ms\nWebsocket heartbeat: **${interaction.client.ws.ping}**ms.`)
            .setThumbnail(iconURL)
            .setFooter({text: footer, iconURL: iconURL})
            .setTimestamp()
            .setColor(color);

        interaction.editReply({embeds: [embed]});
    },
};
