import * as React from 'react';
import '../stylesheets/components/comment.scss';
import Comment from './Comment';
import { CommentProps } from '../props';

class Timeline extends React.Component<CommentProps[], {}> {
    render() {
        let comments = [];
        for (let i in this.props)
            comments.push(this.props[i]);
        return (
            <div className="timeline">
                {comments.map((comment, i) => <Comment key={i} {...comment}/>)}
            </div>
        );
    }
}

export default Timeline;
