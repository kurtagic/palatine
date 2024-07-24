const {SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require("discord.js");
const {color, footer, iconURL} = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rules")
        .setDescription("formatted rules")
        .setDefaultMemberPermissions(PermissionsBitField.Administrator),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setDescription("**RULES**\n1. don't be an asshole\n2. don't be weird\n\nif you still don't understand and like disturbing my peace: <@193320554403594241>.")
            .setThumbnail(interaction.user.displayAvatarURL(interaction.user.avatar))
            .setFooter({text: footer, iconURL: iconURL})
            .setTimestamp()
            .setColor(color)

        interaction.reply({embeds: [embed]});

    },
};