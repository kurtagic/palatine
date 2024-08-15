const {SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType} = require("discord.js");
const {color, footer, iconURL} = require("../config.json");
const sqlite3 = require("sqlite3").verbose();
const canvacord = require('canvacord');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("view user profile"),
        options: [
            {
                name: 'target-user',
                description: 'the user whose profile you want to view',
                type: ApplicationCommandOptionType.Mentionable,
            }
        ],

    async execute(interaction) {
        if (!interaction.inGuild()) {
            interaction.reply('you can only run this command inside a server.');
            return;
        }

        await interaction.deferReply();

        const mentionedUserId = interaction.options.get('target-user')?.value;
        const targetUserId = mentionedUserId || interaction.member.id;
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);

        const db = new sqlite3.Database("./db/main.db");
        const fetchedLevel = getUser(db, targetUserId)

        if (!fetchedLevel) {
            interaction.editReply(
                mentionedUserId
                    ? `${targetUserObj.user.tag} doesn't have any levels yet. Try again when they chat a little more.`
                    : "You don't have any levels yet. Chat a little more and try again."
            );
            return;
        }

        const { Font } = require('canvacord');
        Font.loadDefault();

        const rank = new canvacord.Rank()
            .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
            .setLevel(fetchedLevel.level)
            .setCurrentXP(fetchedLevel.experience)
          //  .setRequiredXP(calculateLevelXp(fetchedLevel.level))
            .setStatus(targetUserObj.presence.status)
            .setProgressBar('#FFC300', 'COLOR')
            .setUsername(targetUserObj.user.username)
            .setDiscriminator(targetUserObj.user.discriminator)
    .setTextStyles({
            level: "LEVEL:",
            xp: "EXP:",
            rank: "RANK:",
        })
            .setStyles({
                progressbar: {
                    thumb: {
                        style: {
                            backgroundColor: "color here, can be hex",
                        },
                    },
                },
            });

        const image = await rank.build({ format: 'png',});
        const attachment = new AttachmentBuilder(image);
        interaction.editReply({ files: [attachment] });

    },
};

function getUser(db, userID) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM experience_ranks WHERE user_id = ?', [userID], (err, row) => {
            if (!row) {
                db.run('INSERT INTO experience_ranks (user_id, experience, level) VALUES (?, ?, ?)', [userID, 0, 1]);

                resolve({ experience: 0, level: 1 });
                return;
            }

            resolve({ experience: row.experience, level: row.level });
        });
    });
}