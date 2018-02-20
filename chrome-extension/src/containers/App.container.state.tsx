import Item from '../models/Item';

export class AppContainerState {
    loading: boolean = true;
    items: Item[];
    err: string;
    username: string;
    webSocket: boolean;
}