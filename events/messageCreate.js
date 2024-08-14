const { Events } = require("discord.js");
const sqlite3 = require("sqlite3").verbose();

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        if (message.author.bot) return;

        const db = new sqlite3.Database("./db/main.db", (err) => {
            if (err) {
                console.error(err.message);
                return;
            }
        });

        const userID = message.author.id;
        const messageContentLength = message.content.length;

        getUser(db, userID).then(({ experience, level }) => {
                const newExperience = experience + messageContentLength;
				
                db.run('UPDATE experience_ranks SET experience = ? WHERE user_id = ?', [newExperience, userID], function(err) {
                    if (err) {
                        return;
                    }

                    message.channel.send(`experience: **${newExperience}**`);
                });
            })
			.catch(err => {
                console.error(err.message);
            })
            .finally(() => {
                db.close((err) => {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                });
            });
    },
};

function getUser(db, userID) {
    return new Promise((resolve, reject) => {
		db.get('SELECT * FROM experience_ranks WHERE user_id = ?', [userID], (err, row) => {
			if (err) {
				reject(err);
				return;
			}

			if (!row) {
				db.run('INSERT INTO experience_ranks (user_id, experience, level) VALUES (?, ?, ?)', [userID, 0, 1], function(err) {
					if (err) {
						reject(err);
						return;
					}

					resolve({ experience: 0, level: 1 });
				});

				return;
			}

			resolve({ experience: row.experience, level: row.level });
		});
	});
}
