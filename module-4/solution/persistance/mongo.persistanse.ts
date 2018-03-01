import { PersistanceInterface } from "./persistance.interface";
import MongoDBClient from "./database/mongo-client";

import Item from "../../../models/Item";


export class MongoPersistance implements PersistanceInterface {
    async deleteItem(itemId: number): Promise<void> {
        let db = await MongoDBClient.connect();
        let result = await db.collection(MongoDBClient.collectionName).deleteOne({ id: itemId});

        return new Promise<void>((resolve, reject) => {
            if(!result) {
                reject("Error deleting item");
            }
            resolve();
        });
    }

    async getItems(): Promise<Item[]> {
        let db = await MongoDBClient.connect();
        let result = await db.collection(MongoDBClient.collectionName).find<Item>({});

        return new Promise<Item[]>((resolve, reject) => {
            if(!result) {
                reject("Error finding items");
            }
            resolve(result.toArray());
        });
    }

    async getItemById(itemId: number): Promise<Item> {
        let db = await MongoDBClient.connect();
        let result = await db.collection(MongoDBClient.collectionName).findOne<Item>({ id: itemId });

        return new Promise<Item>((resolve, reject) => {
            if(!result) {
                reject("Error creating item in mongo");
            }
            resolve(result);
        });
    }

    async insertItem(item: Item): Promise<Item> {
        let db = await MongoDBClient.connect();
        let result = db.collection(MongoDBClient.collectionName).insertOne(item);

        return new Promise<Item>((resolve, reject) => {
            if(!result) {
                reject("Error creating item in mongo");
            }
            resolve(item);
        });
    }

    async updateItem(itemId: number, item: Item): Promise<void> {
        let db = await MongoDBClient.connect();
        let result = await db.collection(MongoDBClient.collectionName).findOneAndUpdate({ id: itemId }, item);

        return new Promise<void>((resolve, reject) => {
            if(!result) {
                reject("Error creating item in mongo");
            }
            resolve();
        });
    }
}