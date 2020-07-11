import * as React from 'react';
import Comment from './Comment';
import { CommentProps } from '../props';

class Timeline extends React.Component<{ comments: CommentProps[], onCommentDelete: (id: string) => void }, {}> {
    render() {
        let comments = [];
        for (let i in this.props.comments)
            comments.push(this.props.comments[i]);
        // <Comment key={i} {...comment}/>
        return (
            <div className="timeline">
                {comments.map((comment, i) => <Comment {...comment} onDelete={this.props.onCommentDelete}/>)} 
            </div>
        );
    }
}

export default Timeline;
