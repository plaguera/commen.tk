import * as React from 'react';
import { PaginationButtonProps } from '../props';

class PaginationButton extends React.Component<PaginationButtonProps, {}> {

    constructor(props: PaginationButtonProps) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.onClick();
    }

    render() {
        if (this.props.hiddenItems <= 0) return (null);
        return (
            <div className="pagination-wrapper">
                <button className='pagination-button' onClick={this.onClick}>
                    <div className='pagination-button-items'>
                        {this.props.hiddenItems} hidden item{this.props.hiddenItems > 1 ? 's' : ''}
                    </div>
                    <div className='pagination-button-load'>
                        Load more...
                    </div>
                </button>
            </div>
        );
    }
}

export default PaginationButton;