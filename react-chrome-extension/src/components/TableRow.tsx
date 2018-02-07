import * as React from 'react';
import TableRowProps from './TableRow.props';
import './TableRow.css';

class TableRow extends React.Component<TableRowProps> {
    constructor(props: TableRowProps) {
        super(props);
        this.onJoinShopping = this.onJoinShopping.bind(this);
    }

    onJoinShopping(event: React.FormEvent<HTMLButtonElement>) {
        if (this.props.item.id) {
            this.props.joinShopping(this.props.item.id);
        }
    }

    render() {
        return (
            <tr>
                <td><img src={this.props.item.imageUrl} /></td>
                <td><a className="ellipsis" target="_blank" href={this.props.item.url}>{this.props.item.name}</a></td>
                <td className="price">{this.props.item.currency} {this.props.item.price}</td>
                <td>
                    <button type="button" onClick={this.onJoinShopping}>+</button>
                </td>
            </tr>
        );
    }
}

export default TableRow;