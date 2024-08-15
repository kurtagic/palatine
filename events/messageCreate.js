const { Events } = require("discord.js");
const sqlite3 = require("sqlite3").verbose();

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        if (message.author.bot) return;

        const db = new sqlite3.Database("./db/main.db");

        const userID = message.author.id;

        getUser(db, userID).then(({ experience, level }) => {
                experience += getRandomInteger(5, 15);

                let experienceLimit = getNewExperienceNeeded(level);

				if(experience >= experienceLimit) {
                    experience -= experienceLimit;
                    level++;
					experienceLimit = getNewExperienceNeeded(level);
                    message.channel.send(`LEVEL UP!`);
                }

                db.run('UPDATE experience_ranks SET experience = ?, level = ? WHERE user_id = ?', [experience, level, userID]);
				message.channel.send(`experience: **${experience}**xp, level: **${level}**, needed: **${experienceLimit}**xp`);
	
		})
		.finally(() => {
			db.close();
        });
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

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getNewExperienceNeeded(level) {
    const base_xp = 50;
    const newLevel = level + 1;
    const factor = 1.5;
	
	return Math.round(base_xp * (newLevel ** factor));
}
