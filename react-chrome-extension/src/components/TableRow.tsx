import * as React from 'react';
import TableRowProps from './TableRow.props';
import './TableRow.css';

class TableRow extends React.Component<TableRowProps> {
    constructor(props: TableRowProps) {
        super(props);
        this.onJoinShopping = this.onJoinShopping.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }

    onJoinShopping(event: React.FormEvent<HTMLButtonElement>) {
        if (this.props.item.id) {
            this.props.joinShopping(this.props.item.id);
        }
    }

    removeItem(event: React.FormEvent<HTMLButtonElement>) {
        if (this.props.item.id) {
            this.props.deleteItem(this.props.item.id);
        }
    }

    render() {
        return (
            <tr>
                <td><img className="item-image" src={this.props.item.imageUrl} /></td>
                <td><a className="ellipsis" target="_blank" href={this.props.item.url}>{this.props.item.name}</a></td>
                <td className="price">{this.props.item.currency} {this.props.item.price}</td>
                <td>
                    <button type="button" onClick={this.onJoinShopping}>+</button>
                </td>
                <td>
                    <button type="button" onClick={this.removeItem}>🗑️</button>
                </td>
            </tr>
        );
    }
}

export default TableRow;