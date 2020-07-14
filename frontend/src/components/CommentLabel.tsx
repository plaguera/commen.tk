import * as React from 'react';
import { CommentLabelProps } from '../props';
import env from '../environment';

class CommentLabel extends React.Component<CommentLabelProps, {}> {
    render() {
        return (
            <div className='comment-label tooltipped tooltipped-below' aria-label={this.props.tooltip}>
                {this.props.children}
            </div>
        );
    }
}

export default CommentLabel;