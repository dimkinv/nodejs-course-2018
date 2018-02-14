import * as React from 'react';
import TableRowProps from './TableRow.props';
import './TableRow.css';
import Loader from './Loader';

class TableRow extends React.Component<TableRowProps> {
    constructor(props: TableRowProps) {
        super(props);
        this.onJoinShopping = this.onJoinShopping.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }

    onJoinShopping(event: React.FormEvent<HTMLButtonElement>) {
        if (this.props.item.id) {
            this.props.joinShopping(this.props.item);
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
                <td>
                    <a
                        className="ellipsis link"
                        target="_blank"
                        href={this.props.item.url}
                        title={this.props.item.name}
                    >{this.props.item.name}
                    </a>
                    <Loader value={this.props.item.numOfBuyers} target={this.props.item.targetNumOfBuyers} />
                </td>
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