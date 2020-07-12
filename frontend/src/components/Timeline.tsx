import * as React from 'react';
import Comment from './Comment';
import { TimelineProps } from '../props';

class Timeline extends React.Component<TimelineProps, {}> {
    render() {
        let comments = [];
        for (let i in this.props.comments)
            comments.push({ value: this.props.comments[i], issueAuthorDidAuthor: this.props.issueAuthor === this.props.comments[i].author.login });
        return (
            <div className="timeline">
                {comments.map((comment, i) => <Comment {...comment.value} onDelete={this.props.onCommentDelete} issueAuthorDidAuthor={comment.issueAuthorDidAuthor} />)} 
            </div>
        );
    }
}

export default Timeline;
