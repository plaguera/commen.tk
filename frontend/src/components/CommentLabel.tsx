import * as React from 'react';
import { CommentLabelProps } from '../props';
import env from '../environment';

class CommentLabel extends React.Component<CommentLabelProps, {}> {
    render() {
        return (

            <div className='comment-label tooltip'>{this.props.children}
                <span className='tooltiptext'>{this.props.tooltip}</span>
            </div>
        );
    }
}

export default CommentLabel;