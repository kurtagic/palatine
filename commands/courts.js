const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const {color, footer} = require("../config.json");
const {getCourts, getCourtHost} = require("../courts_utility/modules");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("courts")
        .setDescription("view all courts_utility in server"),

    async execute(interaction) {
        const courts = await getCourts(interaction.guild);
        const formattedCourts = await formatCourts(courts);

        const embed = new EmbedBuilder()
            .setTitle(`COURTS IN ${interaction.guild.name.toUpperCase()}`)
            .setDescription(formattedCourts)
            .setThumbnail(interaction.guild.iconURL({dynamic: true}))
            .setFooter({text: footer, iconURL: interaction.client.user.avatarURL()})
            .setTimestamp()
            .setColor(color);

        interaction.reply({embeds: [embed]});
    }
};

async function formatCourts(courts) {
    let formattedString = "";

    for (const court of courts.values()) {
        const host = await getCourtHost(court);
        formattedString += `**HOST:** ${host} **COURT:** ${court.url}\n`;
    }

    return formattedString;
}


