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
            console.log('Connected to the main database.');
        });

        const userID = message.author.id;
        const messageContentLength = message.content.length;

        function getUser() {
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

                            resolve({ 0, 1 });
                        });

                        return;
                    }

                    resolve({ row.experience, row.level });
                });
            });
        }

        getUser().then(({ experience, level }) => {
                const newExperience = experience + messageContentLength;
                // Update the experience
                db.run('UPDATE experience_ranks SET experience = ? WHERE user_id = ?', [newExperience, userID], function(err) {
                    if (err) {
                        console.error(err.message);
                        return;
                    }

                    message.channel.send(`experience: **${newExperience}**`);
                });
            })
            .catch(err => {
                console.error(err.message);
            })
            .finally(() => {
                // Close the database connection
                db.close((err) => {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    console.log('Closed the database connection.');
                });
            });
    },
};
