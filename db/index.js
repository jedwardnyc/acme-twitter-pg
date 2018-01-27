const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL)

client.connect();


const SQL_SYNC = `
  DROP TABLE IF EXISTS tweets;
  CREATE TABLE tweets(
    id SERIAL PRIMARY KEY,
    text VARCHAR(255)
  );
`;

const SQL_SEED = `
  INSERT INTO tweets(text) values ('foo');
  INSERT INTO tweets(text) values ('bar');
  INSERT INTO tweets(text) values ('bazz');
`;

const seed = (cb) =>{
  client.query(SQL_SEED, cb);
}

const sync = (cb)=> {
  client.query(SQL_SYNC, cb);
}

const getTweets = (cb)=> {
  client.query('SELECT * from tweets', (err, result) => {
    if(err) return cb(err);
    cb(null, result.rows)
  });

}

const getTweet = (id, cb) => {
  client.query('SELECT * from tweets WHERE id = $1', [id], (err,result) => {
    if(err) return console.log(err);
    cb(null, result.rows.length ? result.rows[0] : null);
  });
}

module.exports = {
  sync,
  getTweets,
  getTweet,
  seed
}