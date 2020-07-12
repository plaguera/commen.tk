import * as React from 'react';
import CommentLabel from './CommentLabel';
import { CommentLabelsProps } from '../props';
import env from '../environment';
import { lowerCaseExceptFirst } from '../util';

class CommentLabels extends React.Component<CommentLabelsProps, {}> {

    author() {
        if (!this.props.issueAuthorDidAuthor) return (null);
        let subject = this.props.viewerDidAuthor ? 'You are' : 'This user is';
        return (
            <CommentLabel tooltip={subject + ' the author of this issue'}>
                Author
            </CommentLabel>
        );
    }

    association() {
        if (this.props.authorAssociation === 'NONE') return (null);
        let subject = this.props.viewerDidAuthor ? 'You are ' : 'This user is ';
        let assoc = (this.props.authorAssociation === 'OWNER' ? ' the ' : ' a ') + this.props.authorAssociation.toLowerCase().replace(/_/, ' ');
        return (
            <CommentLabel tooltip={subject + assoc + ' of the ' + env.attributes.repo.split('/')[1] + ' repository'}>
                {lowerCaseExceptFirst(this.props.authorAssociation.replace(/_/, ' '))}
            </CommentLabel>
        );
    }

    render() {
        return (
            <div className='comment-labels'>
                {this.association()}
                {this.author()}
            </div>
        );
    }
}

export default CommentLabels;