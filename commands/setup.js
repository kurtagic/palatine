const {SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require("discord.js");
const {color, footer} = require("../config.json");
const {initialise} = require("../courts/courts.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("inital setup")
        .setDefaultMemberPermissions(PermissionsBitField.Administrator),

    async execute(interaction) {

        if (!interaction.inGuild()) {
            interaction.reply({content: "You can only run this command inside a server.", ephemeral: true});
            return;
        }

        const channels = await initialise(interaction.guild);

        const embed = new EmbedBuilder()
            .setTitle("INITAL SETUP")
            .setDescription(`The setup is complete! The ${channels.courts.url} category and ${channels.createCourt.url} have been setup. do not edit them manually because that will break everything. Just leave them to the bot please and thank you.\n\nmore info: \`/help\``)
            .setThumbnail(interaction.client.user.displayAvatarURL({dynamic: true}))
            .setFooter({text: footer, iconURL: interaction.client.user.avatarURL()})
            .setTimestamp()
            .setColor(color);

        interaction.reply({embeds: [embed]});
    },
}

