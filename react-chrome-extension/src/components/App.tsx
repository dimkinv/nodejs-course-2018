import * as React from 'react';
import './App.css';
import AppProps from './App.props';
import TableRow from './TableRow';

class App extends React.Component<AppProps> {
    constructor(props: AppProps) {
        super(props);
        this.joinShopping = this.joinShopping.bind(this);
        this.addNewItem = this.addNewItem.bind(this);
    }

    joinShopping(itemId: number) {
        this.props.joinShopping(itemId);
    }

    addNewItem(event: React.FormEvent<HTMLButtonElement>) {
        this.props.addNewItem();
    }

    render() {
        return (
            <>
            <header>Group Shopping</header>
            <hr />
            <button type="button" onClick={this.addNewItem}>+ Publish this item!</button>
            <h3>Current Deals: </h3>
            <table>
                <tbody>
                {this.props.items.map(item => (
                    <TableRow key={item.id} item={item} joinShopping={this.joinShopping} />
                ))}
                </tbody>
            </table>
            </>
        );
    }
}

export default App;