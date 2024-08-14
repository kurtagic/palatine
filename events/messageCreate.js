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

        // Function to handle user data and update experience
        function handleUserData() {
            return new Promise((resolve, reject) => {
                db.get('SELECT * FROM experience_ranks WHERE user_id = ?', [userID], (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    let experience = 0;
                    let level = 1;

                    if (!row) {
                        console.log(`No user found with user_id = ${userID}. Creating a new user.`);
                        db.run('INSERT INTO experience_ranks (user_id, experience, level) VALUES (?, ?, ?)', [userID, experience, level], function(err) {
                            if (err) {
                                reject(err);
                                return;
                            }
                            console.log(`A new user has been created with user_id = ${userID}`);
                            resolve({ experience, level });
                        });
                    } else {
                        console.log(row.experience);
                        experience = row.experience;
                        level = row.level;
                        resolve({ experience, level });
                    }
                });
            });
        }

        // Handle the user data and update experience
        handleUserData()
            .then(({ experience, level }) => {
                const newExperience = experience + messageContentLength;
                console.log(`Current experience: ${experience}`);
                console.log(`Content length: ${messageContentLength}`);
                console.log(`New experience: ${newExperience}`);

                // Update the experience
                db.run('UPDATE experience_ranks SET experience = ? WHERE user_id = ?', [newExperience, userID], function(err) {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    console.log(`Updated experience for user_id = ${userID} to ${newExperience}`);
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
