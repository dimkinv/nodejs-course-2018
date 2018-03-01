import * as React from 'react';
import * as openSocket from 'socket.io-client';
import App from '../components/App';
import { AppContainerState } from './App.container.state';
import Item from '../models/Item';
import { getItemFromPage } from '../crawler';
import Login from '../components/Login';

const baseUrl = 'http://localhost:3000/api/items';
const CACHE_KEY = 'NODEJS_COURSE_GROUP_SHOPPING_ITEMS';
const USERNAME = 'NODEJS_COURSE_GROUP_SHOPPING_NAME';
const X_AUTH = 'X-AUTH';
const headers = new Headers({ 'Content-Type': 'application/json' });

/* tslint:disable */

class AppContainer extends React.Component<{}, AppContainerState> {
    constructor(props: {}) {
        super(props);
        this.state = new AppContainerState();
        this.joinShopping = this.joinShopping.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.addNewItem = this.addNewItem.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.cancelJoining = this.cancelJoining.bind(this);

        // socket.io
        this.openSocketConnection = this.openSocketConnection.bind(this);
        this.handleSocketEvents = this.handleSocketEvents.bind(this);

        // update store
        this.addItemToState = this.addItemToState.bind(this);
        this.deleteItemFromState = this.deleteItemFromState.bind(this);
        this.updateItemInState = this.updateItemInState.bind(this);
    }

    onLogin(username: string) {
        this.setState({ username }, () => {
            window.localStorage.setItem(USERNAME, username);
            headers.append(X_AUTH, username);
            this.getItems();
        });
    }

    onLogout() {
        this.setState({ username: '' }, () => {
            headers.delete(X_AUTH);
            window.localStorage.removeItem(USERNAME);
        });
    }

    addNewItem(): void {
        getItemFromPage()
            .then((item: Item) => {
                return { ...item, targetNumOfBuyers: 10, attuid: this.state.username, buyers: [] };
            })
            .then((item: Item) => this.createGroupShopping(item))
            .catch((err: string) => {
                console.log(err);
            });
    }

    createGroupShopping(item: Item): Promise<void> {
        return fetch(baseUrl, { method: 'POST', headers, body: JSON.stringify(item) })
            .then((res) => this.handleHTTPErrors(res))
            .then(res => res.json())
            .then(this.addItemToState);
    }

    deleteItem(itemId: number) {
        console.log('deleting...', itemId);
        fetch(`${baseUrl}/${itemId}`, { headers, method: 'DELETE' })
            .then((res) => this.handleHTTPErrors(res))
            .then(res => {
                this.deleteItemFromState(itemId);
            });
    }

    joinShopping(item: Item): void {
        if (item.buyers.includes(this.state.username)) {
            return;
        }
        const buyers = item.buyers.concat(this.state.username);
        const updateItem = { ...item, buyers };
        fetch(`${baseUrl}/${item.id}`, { method: 'PUT', headers })
            .then((res) => this.handleHTTPErrors(res))
            .then(res => {
                this.updateItemInState(updateItem);
            });
    }

    cancelJoining(item: Item): void {
        if (!item.buyers.includes(this.state.username)) {
            return;
        }
        const buyers = item.buyers.filter(buyer => buyer !== this.state.username);
        const updateItem = { ...item, buyers };
        fetch(`${baseUrl}/${item.id}`, { method: 'DELETE', headers })
            .then((res) => this.handleHTTPErrors(res))
            .then(res => {
                this.updateItemInState(updateItem);
            });
    }

    getItems() {
        fetch(baseUrl, { headers })
            .then((res) => this.handleHTTPErrors(res))
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
                console.error('Something went wrong here...', err);
                window.localStorage.removeItem(CACHE_KEY);
                this.setState({
                    loading: false,
                    err
                });
            });
    }

    componentDidMount() {
        // Get websocket options
        chrome.storage.sync.get({
            webSocket: false
        }, (items) => {
            this.setState({ webSocket: items.webSocket }, () => {
                if (items.websocket) {
                    this.openSocketConnection();
                }
            });
        });

        // Check if user logged in
        const username = window.localStorage.getItem(USERNAME);
        if (!username) {
            console.log('Please login...');
            this.onLogout();
            return
        }

        console.log('User already logged in!');
        this.setState({
            username
        });
        headers.append(X_AUTH, username);

        // load items from cache
        const cachedItems = window.localStorage.getItem(CACHE_KEY);
        if (cachedItems) {
            this.setState({
                items: JSON.parse(cachedItems) as Item[],
                loading: false
            });
        } else {
            this.setState({ loading: true });
        }

        this.getItems();
    }

    render() {
        return !this.state.username ?
            <Login onLogin={this.onLogin} /> :
            this.state.loading ?
                <div>Loading...</div> :
                this.state.err ?
                    <div style={{ fontSize: '30px' }}>We messed up...🤷</div> :
                    (
                        <App
                            username={this.state.username}
                            onLogout={this.onLogout}
                            items={this.state.items}
                            joinShopping={this.joinShopping}
                            cancelJoining={this.cancelJoining}
                            addNewItem={this.addNewItem}
                            deleteItem={this.deleteItem}
                        />
                    );
    }

    private openSocketConnection() {
        const socket = openSocket('http://localhost:3000');
        this.setState({ socket }, this.handleSocketEvents);
    }

    private handleSocketEvents() {
        this.state.socket.on('add-item', (item: Item) => {
            this.addItemToState(item);
        });
        this.state.socket.on('delete-item', (item: Item) => {
            if (item.id) {
                this.deleteItemFromState(item.id);
            }
        });
        this.state.socket.on('update-item', (item: Item) => {
            this.updateItemInState(item);
        });
    }

    private addItemToState(createdItem: Item) {
        this.setState(
            (prevState => ({
                err: '',
                items: prevState.items.concat(createdItem),
                loading: false,
            })),
            () => {
                this.updateItemsCache(this.state.items);
            });
    }

    private deleteItemFromState(itemId: number) {
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

    private updateItemInState(updateItem: Item) {
        this.setState(
            (prevState) => ({
                err: '',
                items: prevState.items.map(oldItem => {
                    if (oldItem.id === updateItem.id) {
                        return updateItem;
                    }
                    return oldItem;
                }),
                loading: false,
            }),
            () => {
                this.updateItemsCache(this.state.items);
            });
    }

    private updateItemsCache(items: Item[]) {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(items));
    }

    private handleHTTPErrors(res: Response) {
        if (res.status === 401) {
            window.localStorage.removeItem(CACHE_KEY);
            this.setState({
                loading: false,
                username: '',
            });
            return Promise.reject('Please login...');;
        }

        if (res.status >= 400) {
            return Promise.reject(res);
        }
        return Promise.resolve(res);
    }
}

export default AppContainer;
