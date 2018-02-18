import * as React from 'react';
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
    }

    onLogin(username: string) {
        this.setState({username}, () => {
            window.localStorage.setItem(USERNAME, username);
            headers.append(X_AUTH, username);
        });
    }

    onLogout() {
        this.setState({username: ''}, () => {
            headers.delete(X_AUTH);
            window.localStorage.removeItem(USERNAME);
        });
    }

    addNewItem(): void {
        getItemFromPage()
            .then((item: Item) => {
                return { ...item, targetNumOfBuyers: 10, numOfBuyers: 1, attuid: this.state.username };
            })
            .then((item: Item) => this.createGroupShopping(item))
            .catch((err: string) => {
                /* tslint:disable */
                console.log(err);
                this.setState({
                    err
                });
            });
    }

    createGroupShopping(item: Item): Promise<void> {
        return fetch(baseUrl, { method: 'POST', headers, body: JSON.stringify(item) })
            .then(res => res.json()).then((createdItem: Item) => {
                this.setState((prevState => ({
                    err: '',
                    items: prevState.items.concat(createdItem),
                    loading: false,
                })));
            });
    }

    deleteItem(itemId: number) {
        return fetch(`${baseUrl}/${itemId}`, { method: 'DELETE' }).then(res => {
            this.setState(
                (prevState) => ({
                    err: '',
                    items: prevState.items.filter(item => item.id !== itemId),
                    loading: false,
                }), 
                () => {
                    this.updateItemsCache(this.state.items);
                });
        });
    }

    joinShopping(item: Item): void{
        if (item.buyers.includes(this.state.username)) {
            return;
        }
        const buyers = item.buyers.concat(this.state.username);
        const updateItem = {...item, numOfBuyers: item.numOfBuyers + 1, buyers};
        fetch(`${baseUrl}/${item.id}`, { method: 'PUT', headers }).then(res => {
            this.setState(
                (prevState) => ({
                    err: '',
                    items: prevState.items.map(oldItem => {
                        if (oldItem.id === item.id) {
                            return updateItem;
                        }
                        return oldItem;
                    }),
                    loading: false,
                }), 
                () => {
                    this.updateItemsCache(this.state.items);
                });
        });
    }

    cancelJoining(item:Item): void {
        if (!item.buyers.includes(this.state.username)) {
            return;
        }
        const buyers = item.buyers.filter(buyer => buyer!==this.state.username);
        const updateItem = {...item, numOfBuyers: item.numOfBuyers - 1, buyers};
        fetch(`${baseUrl}/${item.id}`, { method: 'DELETE', headers }).then(res => {
            this.setState(
                (prevState) => ({
                    err: '',
                    items: prevState.items.map(oldItem => {
                        if (oldItem.id === item.id) {
                            return updateItem;
                        }
                        return oldItem;
                    }),
                    loading: false,
                }), 
                () => {
                    this.updateItemsCache(this.state.items);
                });
        });
    }



    componentDidMount() {
        const username = window.localStorage.getItem(USERNAME);
        if(username) {
            this.setState({
                username
            });
        }

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
        return !this.state.username ? 
        <Login onLogin={this.onLogin}/> :
        this.state.loading ?
            <div>Loading...</div> :
            this.state.err ?
                <div>oh no! {JSON.stringify(this.state.err)}</div> :
                <App
                    username={this.state.username}
                    onLogout={this.onLogout}
                    items={this.state.items}
                    joinShopping={this.joinShopping}
                    cancelJoining={this.cancelJoining}
                    addNewItem={this.addNewItem}
                    deleteItem={this.deleteItem} />;
    }
}

export default AppContainer;
