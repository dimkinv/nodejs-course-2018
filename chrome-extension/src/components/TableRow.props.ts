import Item from '../models/Item';

export default interface TableRowProps {
    item: Item;
    joinShopping(id: number): void;
    deleteItem(id: number): void;
}