import * as React from 'react';
import App from '../components/App';
import { AppContainerState } from './App.container.state';
import Item from '../models/Item';
import { getItemFromPage } from '../crawler';

const baseUrl = 'http://localhost:3000/items';
const CACHE_KEY = 'NODEJS_COURSE_GROUP_SHOPPING_ITEMS';

class AppContainer extends React.Component<{}, AppContainerState> {
    constructor(props: {}) {
        super(props);
        this.state = new AppContainerState();
        this.joinShopping = this.joinShopping.bind(this);
        this.addNewItem = this.addNewItem.bind(this);
    }

    createGroupShopping(item: Item): Promise<void> {
        return fetch(baseUrl, {method: 'POST', body: JSON.stringify(item)})
                .then(res => res.json()).then((id: number) => {
                    this.setState((prevState => ({
                        items: prevState.items.concat([{...item, id}])
                    })));
                });
    }

    joinShopping(itemId: number) {
        // tbd...
    }

    addNewItem(): void {
        getItemFromPage()
        .then(this.createGroupShopping)
        .catch( (err: string) => {
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
        }

        // this.setState({
        //     loading: true,
        // });
        fetch(baseUrl)
        .then(res => res.json())
        .then(items => {
            this.setState({
                items,
                loading: false,
            });
            return items;
        })
        .then(items => {
            window.localStorage.setItem(CACHE_KEY, JSON.stringify(items));
        })
        .catch(err => {
            window.localStorage.removeItem(CACHE_KEY);
            this.setState({
                loading: false,
                err: 'oh no!',
            });
        });
    }

    render() {
        return this.state.loading ?
            <div>Loading...</div> :
            this.state.err ?
            <div>oh no!</div> :
            <App items={this.state.items} joinShopping={this.joinShopping} addNewItem={this.addNewItem} />;
    }
}

export default AppContainer;
