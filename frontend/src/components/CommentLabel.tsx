import * as React from 'react';
import { CommentLabelProps } from '../props';
import env from '../environment';

class CommentLabel extends React.Component<CommentLabelProps, {}> {

    render() {
        return (
            <span className='comment-label tooltip' aria-label={this.props.tooltip}>
                {this.props.children}
            </span>
        );
    }
}

export default CommentLabel;