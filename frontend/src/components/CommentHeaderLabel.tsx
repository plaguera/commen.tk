import * as React from 'react';
import { CommentHeaderLabelProps } from '../props';
import env from '../environment';

class CommentHeaderLabel extends React.Component<CommentHeaderLabelProps, {}> {
    render() {
        let assoc = this.props.authorAssociation;
        if (assoc !== 'NONE') {
            let className = AUTHOR_ASSOCIATION_STRONG[assoc] ? 'comment-header-label strong tooltip' : 'comment-header-label tooltip';
            let text = this.props.authorAssociation.toLocaleLowerCase().replace(/^\w/, c => c.toUpperCase());
            let tooltip = `You are the ${assoc.toLowerCase()} of the ${env.attributes.repo.split('/')[1]} repository`;
            return (
                <span className={className} aria-label={tooltip}>{text}</span>
            );
        }
        return (null);
    }
}

const AUTHOR_ASSOCIATION_STRONG: { [id: string] : boolean; } = {
    'COLLABORATOR': false,
    'CONTRIBUTOR': false,
    'FIRST_TIMER': false,
    'FIRST_TIME_CONTRIBUTOR': false,
    'MEMBER': true,
    'NONE': false,
    'OWNER': true
}

export default CommentHeaderLabel;