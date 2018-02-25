import { MongoClient, Db } from "mongodb"


class DBClient {
    private url = "mongodb://localhost:27017/test";
    public db: Db;

    public async connect() {
        this.db = await MongoClient.connect(this.url);
        console.log("Connected to db");

        return this.db;
    }
}

export = new DBClient();