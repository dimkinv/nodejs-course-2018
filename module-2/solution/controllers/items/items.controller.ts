import { Request, Response } from 'express';
import Item from '../../../../models/Item';

let currentId = 0;
const items: Item[] = [];
const AUTH_HEADER = 'x-auth';

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
        const user = req.headers[AUTH_HEADER];

        if(user === itemToUpdate.attuid){
            res.status(400).json({message: 'You cannot join to your own item'});
            return;
        }

        if(itemToUpdate.buyers.includes(user)){
            res.status(400).json({message: 'You are already subscribed to this item'});
            return;
        }

        const index = items.findIndex(item => item.id === id)
        if (index === -1) {
            res.status(404).json({ message: `item with id ${id} not found` });
            return;
        }

        items[index] = itemToUpdate;
        res.send(itemToUpdate);
    }
}