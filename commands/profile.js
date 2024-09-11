const {SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType, AttachmentBuilder} = require("discord.js");
const {color, footer, iconURL} = require("../config.json");
const canvacord = require('canvacord');
const {getUser} = require("../utils/database.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("view user profile")
        .addMentionableOption(option => option.setName('target-user')
            .setDescription('the user whose profile you want to view')),

    async execute(interaction) {
        if (!interaction.inGuild()) {
            interaction.reply('you can only run this command inside a server.');
            return;
        }

        await interaction.deferReply();

        const mentionedUserId = interaction.options.get('target-user')?.value;
        const targetUserId = mentionedUserId || interaction.member.id;
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);

        // Fetch user level and experience from the database
        const fetchedLevel = await getUser(targetUserId);

        if (!fetchedLevel) {
            interaction.editReply(mentionedUserId ? `${targetUserObj.user.tag} doesn't have any levels yet. Try again when they chat a little more.` : "You don't have any levels yet. Chat a little more and try again.");
            return;
        }

        const {Font} = require('canvacord');
        Font.loadDefault();

        const rank = new canvacord.Rank()
            .setAvatar(targetUserObj.user.displayAvatarURL({size: 256}))
            .setLevel(fetchedLevel.level)
            .setCurrentXP(fetchedLevel.experience)
            // .setRequiredXP(calculateLevelXp(fetchedLevel.level))
            .setStatus(targetUserObj.presence?.status || "offline")
            .setProgressBar('#FFC300', 'COLOR')
            .setUsername(targetUserObj.user.username)
            .setDiscriminator(targetUserObj.user.discriminator)
            .setTextStyles({
                level: "LEVEL:", xp: "EXP:", rank: "RANK:",
            })
            .setStyles({
                progressbar: {
                    thumb: {
                        style: {
                            backgroundColor: "#FFC300",
                        },
                    },
                },
            });

        const image = await rank.build({format: 'png'});
        const attachment = new AttachmentBuilder(image);
        interaction.editReply({files: [attachment]});
    },
};