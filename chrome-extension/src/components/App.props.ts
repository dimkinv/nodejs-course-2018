import Item from '../models/Item';

export default interface AppProps {
    items: Item[];
    username: string;
    joinShopping(itemId: number): void;
    deleteItem(itemId: number): void;
    addNewItem(): void;
    onLogout(): void;
}