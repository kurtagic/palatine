const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { color, footer } = require("../config.json");
const { getCourtChannel, getCourtHost, getCourtGuests } = require("../courts/modules.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("court")
        .setDescription("view court")
        .addMentionableOption(option => option
            .setName("host")
            .setDescription("view host's court")
            .setRequired(false)
        ),

    async execute(interaction) {
        const mentionedUserID = interaction.options.get("host")?.value;
        const targetUserID = mentionedUserID || interaction.member.id;
        const targetUser = await interaction.guild.members.fetch(targetUserID);

        const court = await getCourtChannel(targetUser);

        if (!court) {
            interaction.reply({ content: "This user has no court.", ephemeral: true });
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
            .addFields(
                { name: "Host", value: `${host.user}`, inline: true },
                { name: "Guests", value: guests.size > 0 ? formattedGuests : "None", inline: true },
                { name: "Time Active", value: formattedActiveTime, inline: true },
                { name: "Join", value: `${court.url}`, inline: true },
                { name: "Invite Link", value: `${invite}`, inline: true }
            )
            .setThumbnail(targetUser.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: footer, iconURL: interaction.client.user.avatarURL() })
            .setTimestamp()
            .setColor(color);

        interaction.reply({ embeds: [embed] });
    },
};

function formatGuests(guests) {
    let formattedString = "";
    guests.forEach(guest => formattedString += `${guest.user}\n`);

    return formattedString;
}

function formatTime(timeMS) {
    const seconds = Math.floor((timeMS / 1000) % 60);
    const minutes = Math.floor((timeMS / (1000 * 60)) % 60);
    const hours = Math.floor((timeMS / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeMS / (1000 * 60 * 60 * 24));

    let formattedTime = "";
    if (days > 0) {
        formattedTime += `${days}d `;
    }
    if (hours > 0 || days > 0) {
        formattedTime += `${hours}h `;
    }
    if (minutes > 0 || hours > 0 || days > 0) {
        formattedTime += `${minutes}mins `;
    }

    formattedTime += `${seconds}sec`;

    return formattedTime;
}
