import * as React from 'react';
import * as request from '../request';
import '../stylesheets/components/comment.scss';
import Avatar from './Avatar';

export interface CommentProps {
    url: string;
    key: string;
    body: string;
    created_at: string;
    author: {
        login: string,
        url: string,
        avatarUrl: string
    }
}

class Comment extends React.Component<CommentProps, {}> {

    render() {
        return (
            <div className="comment-wrapper">
                <Avatar user={this.props.author.login} />
                <div className="comment arrow-box">
                    <div className="comment-header">
                        <div className="comment-header-anchor">
                            <strong>
                                <a className="author" href={this.props.author.url}>{this.props.author.login}</a>
                            </strong>
                             commented 
                            <a className="time-ago" title={formatDate(this.props.created_at)} href={this.props.url}>
                                {timeAgo(this.props.created_at)}
                            </a>
                        </div>
                    </div>
                    <div className="comment-body">
                        <p>
                            {this.props.body}
                        </p>
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