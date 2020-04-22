import * as React from 'react';
import { PaginationButtonProps } from '../props';
import { PageAttributes } from '../page-attributes';

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
        if (this.props.user) {
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
        else {
            return (
                <div className="pagination-wrapper">
                    <a href={PageAttributes.base_url + 'authorize/'}>
                        <button className='pagination-button'>
                            <div className='pagination-button-items'>
                                {this.props.hiddenItems} hidden item{this.props.hiddenItems > 1 ? 's' : ''}
                            </div>
                            <div className='pagination-button-load'>
                                Sign in to load more...
                            </div>
                        </button>
                    </a>
                </div>
            );
        }
    }
}

export default PaginationButton;