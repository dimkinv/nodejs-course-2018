const items = [];

export class ItemsController {
    constructor() {
        this.get = this.get.bind(this);
    }
    get() {
        return items;
    }
}