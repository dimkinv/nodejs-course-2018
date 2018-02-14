import Item from '../models/Item';

export default interface TableRowProps {
    item: Item;
    joinShopping(item: Item): void;
    deleteItem(id: number): void;
}