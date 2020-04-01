import * as React from 'react';
import '../stylesheets/components/header.scss';

class Header extends React.Component<{ commentCount: number, url: string }, {}> {

    render() {
        return (
            <div className="header-wrapper">
                <a className="header-comment-count" href={this.props.url}>
                    <strong>
                    {this.props.commentCount + ' Comment' + (this.props.commentCount > 1 ? 's' : '')}
                    </strong>
                </a>
            </div>
        );

    }
}

export default Header;