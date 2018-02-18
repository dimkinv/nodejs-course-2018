import { Request, Response } from 'express';
import Item from '../../../../models/Item';

let currentId = 0;
const items: Item[] = [];

export class ItemsController {
    constructor() {
        this.get = this.get.bind(this);
        this.put = this.put.bind(this);
        this.post = this.post.bind(this);
    }
    get(req: Request, res: Response) {
        res.send(items);
    }

    post(req: Request, res: Response) {
        const item = req.body as Item;
        item.id = currentId++;
        items.push(item);

        res.send(item);
    }

    put(req: Request, res: Response) {
        const id = +req.params.id as number;
        const itemToUpdate = req.body as Item;

        const index = items.findIndex(item => item.id === id)
        if (index === -1) {
            res.status(404).json({ message: `item with id ${id} not found` });
            return;
        }

        items[index] = itemToUpdate;
        res.send(itemToUpdate);
    }
}