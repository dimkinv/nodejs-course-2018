import DBClient = require("./database-client");
// import {createConnection, Query, escape} from 'mysql';
//
// let connection = createConnection({
//     host: 'localhost',
//     user: 'me',
//     password: 'test'
// });
//
// connection.connect();
//
// connection.query('SELECT * from users', (err, rows, fields) => {
//     if (err) throw err;
//
//     console.log('The solution is: ', rows);
// });
//
// let post = { id: 1, title: 'Hello MySQL' };
// let query = connection.query('INSERT INTO posts SET ?', post, function (err, result) {
//     console.log("Success to insert: ", JSON.stringify(post));
// });

class App {
    public async start() {
        console.log("Starting application...2 + 1");

        try {
            let db = await DBClient.connect();

            let results = await db.collection("products").insertOne({
                topic: "learn angular.js", progress: 10
            });

            console.log(results.insertedId);

            let results2 = await db.collection("todo").insertMany([
                {  topic: "learn typescript", progress: 10 },
                {  topic: "learn node.js", progress: 10 }
            ]);

            console.log(results2.insertedIds);

            let docs = await db.collection("todo").find().toArray();


            let result = db.collection("products").updateOne({topic: "camera"}, {cost: 12});

            db.collection("products").deleteOne({ progress: 10 });

            console.log(docs);


        } catch (error) {
            console.log("Unable to connect to db");

        }
    }
}

const app = new App();
app.start();
