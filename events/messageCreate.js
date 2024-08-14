const {Events} = require("discord.js");

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        console.log(message);
        if(message.author.bot === true) return;

        // 1. get user from db
        //2. create user in db if not exists, id=message.author.id,experience=0
        // 3. get experience user.experience

        const db = new sqlite3.Database("./db/main.db", (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the main database.');
        });

        db.all('SELECT * FROM users WHERE user_id = ${message.author.id}', [], (err, rows) => {
            if (error) {
                throw error;
            }
            if (row) {
                    console.log(row);
            } else {
                console.log(`No user found with user_id = ${userId}. Creating a new user.`);

                db.run(
                    'INSERT INTO users (user_id, experience, level) VALUES (${message.author.id}, 0, 1)',
                    [user_id, experience, level],
                    function (err) {
                        if (err) {
                            return console.error(err.message);
                        }
                        console.log(`A new user has been created with user_id = ${message.author.id}`);
                    });
            }
        });

        let experience =0;
        experience += message.content.length;
        console.log(experience);

        db.close((err) => {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log('Closed the database connection.');
        });
    },
};
