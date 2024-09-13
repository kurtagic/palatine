const {SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType} = require("discord.js");
const {color, footer} = require("../config.json");
const {formatTime} = require("../utils/helper.js");
const {getCourtChannel, getCourtHost, getCourtGuests} = require("../courts/courts");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("court")
        .setDescription("court-related commands")

        // View Court Subcommand
        .addSubcommand(subcommand => subcommand
            .setName("view")
            .setDescription("view a user's court")
            .addMentionableOption(option => option
                .setName("target-user")
                .setDescription("the user whose court you want to view")
                .setRequired(false))),

    async execute(interaction) {

        if (!interaction.inGuild()) {
            interaction.reply({ content: "You can only run this command inside a server.", ephemeral: true});
            return;
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "view") {
            viewSubcommand(interaction);
        }
    },
};

async function viewSubcommand(interaction) {
    const mentionedUserID = interaction.options.get("target-user")?.value;
    const targetUserID = mentionedUserID || interaction.member.id;
    const targetUser = await interaction.guild.members.fetch(targetUserID);

    const court = await getCourtChannel(targetUser);

    if (!court) {
        interaction.reply({ content: "This user has no court.", ephemeral: true});
        return;
    }

    const host = await getCourtHost(court);
    const guests = await getCourtGuests(court);
    const formattedGuests = formatGuests(guests);

    const timeActive = Date.now() - court.createdTimestamp;
    const formattedActiveTime = await formatTime(timeActive);
    const invite = await court.createInvite();

    const embed = new EmbedBuilder()
        .setTitle(`${court.name.toUpperCase()}`)
        .setDescription(`join: ${court.url}`)
        .addFields({name: "Host", value: `${host.user}`, inline: true},
            {name: "Guests", value: guests.size > 0 ? formattedGuests : "None", inline: true },
            {name: "Time Active", value: formattedActiveTime, inline: true},
            {name: "Invite Link", value: `${invite}`})
        .setThumbnail(targetUser.user.displayAvatarURL({dynamic: true}))
        .setFooter({text: footer, iconURL: interaction.client.user.avatarURL()})
        .setTimestamp()
        .setColor(color);

    interaction.reply({embeds: [embed]});
}

function formatGuests(guests) {
    let formattedString = "";
    guests.forEach((guest) => {
        formattedString += `${guest.user}\n`;
    });

    return formattedString;
}
