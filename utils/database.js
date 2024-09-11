const sqlite3 = require("sqlite3").verbose();

module.exports = {
    pingDatabase: function() {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const db = new sqlite3.Database("./db/main.db", sqlite3.OPEN_READ);

            db.get('SELECT 1 AS result', (err, row) => {
                db.close();

                if (err) {
                    return reject(err);
                }

                const endTime = Date.now();
                const duration = endTime - startTime;

                resolve(duration);
            });
        });
    },
    getUser: function(userID) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database("./db/main.db");

            db.get('SELECT * FROM experience_ranks WHERE user_id = ?', [userID], (err, row) => {
                if (err) {
                    db.close();
                    return reject(err);
                }

                if (!row) {
                    db.run('INSERT INTO experience_ranks (user_id, experience, level) VALUES (?, ?, ?)', [userID, 0, 1], (err) => {
                        db.close();
                        if (err) {
                            return reject(err);
                        }
                        resolve({ experience: 0, level: 1 });
                    });
                } else {
                    db.close();
                    resolve({ experience: row.experience, level: row.level });
                }
            });
        });
    }
};