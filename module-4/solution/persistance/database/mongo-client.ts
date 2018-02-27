import { MongoClient, Db } from "mongodb"

class MongoDBClient {
    private uri = "mongodb://localhost:27017";
    private dbName = "items";
    public collectionName = "items";
    public db: Db;
    public async connect():Promise<Db> {
        return new Promise<Db>((resolve, reject) => {
            MongoClient.connect(this.uri)
            .then((connection) => {
                this.db = connection.db(this.dbName);
                resolve(this.db);
            })
            .catch((error) => {
                reject(error)
            });
        });
    }
}

const client = new MongoDBClient();
export default client;