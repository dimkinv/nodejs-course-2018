import Item from '../models/Item';

export default interface AppProps {
    items: Item[];
    joinShopping(itemId: number): void;
    addNewItem(): void;
}