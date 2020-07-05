import * as React from 'react';
import Comment from './Comment';
import { CommentProps } from '../props';

class Timeline extends React.Component<CommentProps[], {}> {
    render() {
        let comments = [];
        for (let i in this.props)
            comments.push(this.props[i]);
        // <Comment key={i} {...comment}/>
        return (
            <div className="timeline">
                {comments.map((comment, i) => <Comment {...comment}/>)} 
            </div>
        );
    }
}

export default Timeline;
