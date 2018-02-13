import * as React from 'react';
import App from '../components/App';
import { AppContainerState } from './App.container.state';
import Item from '../models/Item';
import { getItemFromPage } from '../crawler';

const baseUrl = 'http://localhost:3000/items';
const CACHE_KEY = 'NODEJS_COURSE_GROUP_SHOPPING_ITEMS';
const headers = new Headers({ 'Content-Type': 'application/json' });

class AppContainer extends React.Component<{}, AppContainerState> {
    constructor(props: {}) {
        super(props);
        this.state = new AppContainerState();
        this.joinShopping = this.joinShopping.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.addNewItem = this.addNewItem.bind(this);
    }

    createGroupShopping(item: Item): Promise<void> {
        return fetch(baseUrl, { method: 'POST', headers, body: JSON.stringify(item) })
            .then(res => res.json()).then((id: number) => {
                this.setState((prevState => ({
                    err: '',
                    items: prevState.items.concat([{ ...item, id }]),
                    loading: false,
                })));
            });
    }

    joinShopping(itemId: number) {
        // tbd...
    }

    async deleteItem(itemId: number) {
        await fetch(`${baseUrl}/${itemId}`, { method: 'DELETE' });
        this.setState(
            (prevState) => ({
                err: '',
                items: prevState.items.filter(item => item.id !== itemId),
                loading: false,
            }), 
            () => {
                this.updateItemsCache(this.state.items);
            });
    }

    addNewItem(): void {
        getItemFromPage()
            .then((item: Item) => this.createGroupShopping(item))
            .catch((err: string) => {
                /* tslint:disable */
                console.log(err);
                this.setState({
                    err
                });
            });
    }

    componentDidMount() {
        const cachedItems = window.localStorage.getItem(CACHE_KEY);
        if (cachedItems) {
            this.setState({
                items: JSON.parse(cachedItems) as Item[],
                loading: false
            });
        } else {
            this.setState({loading: true});
        }

        fetch(baseUrl)
            .then(res => res.json())
            .then(items => {
                this.setState({
                    items,
                    loading: false,
                }, () => {
                    this.updateItemsCache(this.state.items);
                });
            })
            .catch(err => {
                window.localStorage.removeItem(CACHE_KEY);
                this.setState({
                    loading: false,
                    err
                });
            });
    }

    updateItemsCache(items: Item[]) {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(items));
    }

    render() {
        return this.state.loading ?
            <div>Loading...</div> :
            this.state.err ?
                <div>oh no! {this.state.err}</div> :
                <App
                    items={this.state.items}
                    joinShopping={this.joinShopping}
                    addNewItem={this.addNewItem}
                    deleteItem={this.deleteItem} />;
    }
}

export default AppContainer;
