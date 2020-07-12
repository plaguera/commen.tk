import * as React from 'react';
import ReactHtmlParser from 'react-html-parser';
import Avatar from './Avatar';
import { CommentProps } from '../props';
import CommentLabels from './CommentLabels';
import DetailsMenu from './DetailsMenu';
import env from '../environment';

class Comment extends React.Component<CommentProps, {}> {

    constructor(props: CommentProps) {
        super(props);
        this.onDelete = this.onDelete.bind(this);
    }

    onDelete() {
        this.props.onDelete(this.props.id);
    }

    tooltip(assoc: string, scope: string) {
        switch (scope) {
            case 'repo':
                return `You are the ${assoc} of the ${env.attributes.repo.split('/')[1]} repository`;
            case 'issue':
                return `You are the ${assoc} of this issue`;
            default:
                return '';
        }
    }

    render() {
        let author = this.props.viewerDidAuthor ? ' isauthor' : '';
        // authorAssociation={this.props.authorAssociation} issueAuthorDidAuthor={this.props.issueAuthorDidAuthor} viewerDidAuthor={this.props.viewerDidAuthor}
        return (
            <div className={'comment-wrapper' + author}>
                <Avatar {...this.props.author} />
                <div className='comment arrow-box'>
                    <div className='comment-header'>
                        <h3 className='comment-header-text'>
                            <strong>
                                <a className='author' href={this.props.author.url}>{this.props.author.login}</a>
                            </strong>
                            <a> commented </a>
                            <a className='time-ago' title={formatDate(this.props.createdAt)} href={this.props.url}>
                                {timeAgo(this.props.createdAt)}
                            </a>
                        </h3>
                        <CommentLabels {...this.props} />
                        {
                            this.props.viewerDidAuthor ? (
                                <DetailsMenu>
                                    <button className='btn-danger' onClick={this.onDelete}>Delete</button>
                                </DetailsMenu>
                            ) : (
                                    null
                                )
                        }
                    </div>
                    <div className='comment-body'>
                        {ReactHtmlParser(this.props.bodyHTML)}
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
    if (time.years > 1)
        return time.years + ' years ago';
    else if (time.years > 0)
        return time.years + ' year ago';
    else if (time.days > 1)
        return time.days + ' days ago';
    else if (time.days > 0)
        return time.days + ' day ago';
    else if (time.hours > 1)
        return time.hours + ' hours ago';
    else if (time.hours > 0)
        return time.hours + ' hour ago';
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