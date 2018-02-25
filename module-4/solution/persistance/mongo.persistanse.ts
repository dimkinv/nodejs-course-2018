import { PersistanceInterface } from "./persistance.interface";
import MongoDBClient from "./database/mongo-client";

import Item from "../../../models/Item";


export class MongoPersistance implements PersistanceInterface {
    async deleteItem(itemId: number): Promise<void> {
        let promise = new Promise<void>();
        try {
            let db = await MongoDBClient.connect();
            await db.collection(MongoDBClient.collectionName).deleteOne({ id: itemId});
            promise.resolve();
        } catch(error) {
            promise.reject(error);
        }

        return promise;
    }

    async getItems(): Promise<Item[]> {
        let promise = new Promise<Item[]>();
        try {
            let db = await MongoDBClient.connect();
            promise.resolve((await db.collection(MongoDBClient.collectionName).find<Item>()).toArray());
        } catch(error) {
            promise.reject(error);
        }

        return promise;
    }

    async getItemById(itemId: number): Promise<Item> {
        let promise = new Promise<Item>();
        try {
            let db = await MongoDBClient.connect();
            promise.resolve(await db.collection(MongoDBClient.collectionName).findOne<Item>({ id: itemId }));
        } catch(error) {
            promise.reject(error);
        }

        return promise;
    }

    async insertItem(item: Item): Promise<Object> {
        let promise = new Promise<Object>();
        try {
            let db = await MongoDBClient.connect();
            promise.resolve((await db.collection(MongoDBClient.collectionName).insertOne(item)).result);
        } catch(error) {
            promise.reject(error);
        }

        return promise;
    }

    async updateItem(itemId: number, item: Item): Promise<void> {
        let promise = new Promise<void>();
        try {
            let db = await MongoDBClient.connect();
            await db.collection(MongoDBClient.collectionName).updateOne({ id: itemId }, item);
            promise.resolve();
        } catch(error) {
            promise.reject(error);
        }

        return promise;
    }
}