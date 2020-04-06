import * as React from 'react';
import Markdown from 'react-markdown'
import Avatar from './Avatar';
import { CommentProps } from '../props';

class Comment extends React.Component<CommentProps, {}> {
    render() {
        return (
            <div className="comment-wrapper">
                <Avatar {...this.props.author}/>
                <div className="comment arrow-box">
                    <div className="comment-header">
                        <div className="comment-header-anchor">
                            <strong>
                                <a className="author" href={this.props.author.url}>{this.props.author.login}</a>
                            </strong>
                            <a> commented </a>
                            <a className="time-ago" title={formatDate(this.props.createdAt)} href={this.props.url}>
                                {timeAgo(this.props.createdAt)}
                            </a>
                        </div>
                    </div>
                    <div className="comment-body">
                        <Markdown source={this.props.body} />
                    </div>
                </div>
            </div>
        );
    }
}

function formatDate(date: string) {
    return new Date(date).toUTCString();
}

function timeElapsed(date: string) {
    let today = Date.now();
    let then = new Date(date);
    let seconds = Math.floor((today.valueOf() - then.valueOf()) / 1000);

    return {
        seconds: (((seconds % 31536000) % 86400) % 3600) % 60,
        minutes: Math.floor((((seconds % 31536000) % 86400) % 3600) / 60),
        hours: Math.floor(((seconds % 31536000) % 86400) / 3600),
        days: Math.floor((seconds % 31536000) / 86400),
        years: Math.floor(seconds / 31536000)
    };
}

function timeAgo(date: string) {
    let time = timeElapsed(date);
    if (time.years > 0)
        return time.years + ' years ago';
    else if (time.days > 0)
        return time.days + ' days ago';
    else if (time.hours > 0)
        return time.hours + ' hours ago';
    else if (time.minutes > 1)
        return time.minutes + ' minutes ago';
    else if (time.minutes > 0)
        return time.minutes + ' minute ago';
    else if (time.seconds > 10)
        return time.seconds + ' seconds ago';
    else
        return 'just now';
}

export default Comment;