const { Events } = require("discord.js");
const sqlite3 = require("sqlite3").verbose();

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        if (message.author.bot) return;

        const db = new sqlite3.Database("./db/main.db");

        const userID = message.author.id;
        const messageContentLength = message.content.length;

        getUser(db, userID).then(({ experience, level }) => {
                const newExperience = experience + messageContentLength;
				
                db.run('UPDATE experience_ranks SET experience = ? WHERE user_id = ?', [newExperience, userID]);
				message.channel.send(`experience: **${newExperience}**`);
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
