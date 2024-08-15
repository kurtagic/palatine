const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const {color, footer, iconURL} = require("../config.json");
const sqlite3 = require("sqlite3").verbose();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("get latency"),

    async execute(interaction) {
        const sent = await interaction.reply({
            content: "Pinging...",
            fetchReply: true,
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

function pingDatabase() {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        const db = new sqlite3.Database("./db/main.db");
        db.get('SELECT 1 AS result');
		db.close();
		
		const endTime = Date.now();
		
		resolve(endTime - startTime);
    });
}
