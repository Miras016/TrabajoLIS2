const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./labingsoft.db",sqlite3.OPEN_READWRITE, (err)=>{
    if(err) return console.error(err);
});

// const sql_videos = 'DROP TABLE sessions';
const sql = 'CREATE TABLE sessions (token TEXT PRIMARY KEY, expirationDate DATE NON NULL);'

// db.run(sql_videos);
db.run(sql);