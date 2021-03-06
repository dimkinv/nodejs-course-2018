import { Request, Response } from 'express';
import Item from '../../../../models/Item';
import { PersistanceInterface } from '../../persistance/persistance.interface';

let currentId = 0;
const AUTH_HEADER = 'x-auth';

export class ItemsController {
    constructor(private persistance: PersistanceInterface) {
        this.get = this.get.bind(this);
        this.put = this.put.bind(this);
        this.post = this.post.bind(this);
        this.delete = this.delete.bind(this);
    }

    async get(req: Request, res: Response) {
        try {
            const items = await this.persistance.getItems();
            res.send(items);

        } catch (error) {
            res.status(500).json(error);
        }
    }

    async post(req: Request, res: Response) {
        try {
            const item = req.body as Item;
            item.id = currentId++;
            const itemAfterInsert = await this.persistance.insertItem(item);

            res.send(itemAfterInsert);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async put(req: Request, res: Response) {
        try {
            const id = +req.params.id as number;
            const user: string = req.headers[AUTH_HEADER] as string;

            const item = await this.persistance.getItemById(id);

            if (!item) {
                res.status(404).json({ message: `item with id ${id} not found` });
                return
            }

            if (user === item.attuid) {
                res.status(400).json({ message: 'You cannot join to your own item' });
                return;
            }

            if (item.buyers.includes(user)) {
                res.status(400).json({ message: 'You are already subscribed to this item' });
                return;
            }

            item.buyers = item.buyers.concat(user);
            await this.persistance.updateItem(item.id, item);
            res.json(item);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async delete(req: Request, res: Response) {
        const id = +req.params.id as number;
        const user = req.headers[AUTH_HEADER] as string;
        const item = await this.persistance.getItemById(id);

        if (!item) {
            res.status(404).json({ message: `item with id ${id} not found` });
            return
        }

        if (user === item.attuid) {
            // delete item
            this.persistance.deleteItem(item.id);
            res.sendStatus(204);
            return;
        }

        if (!item.buyers.includes(user)) {
            res.status(400).json({ message: 'you are not part of this item buyers' });
            return;
        }

        // cancel joining
        item.buyers = item.buyers.filter(buyer => buyer !== user);
        await this.persistance.updateItem(item.id, item);
        res.sendStatus(204);
    }
}