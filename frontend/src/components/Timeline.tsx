import * as React from 'react';
import * as request from '../request';
import '../stylesheets/components/comment.scss';
import Comment, { CommentProps } from './Comment';

interface Issue {
    user: string;
    repo: string;
    number: number;
}

class Timeline extends React.Component<Issue, {}> {

    state = {
        comments: []
    };

    componentDidMount() {
        request.get(`repos/${this.props.user}/${this.props.repo}/issues/${this.props.number}/comments`)
            .then(result => {
                this.setState({ comments: result.data.repository.issue.comments.nodes })
                //console.log(this.state.comments);
            })
            .catch(console.log);
    }

    render() {
        return (
            <ul className="timeline">
                {this.state.comments.map(comment =>
                    (
                        <Comment url={comment['url']}
                            key={comment['id']}
                            body={comment['body']}
                            created_at={comment['createdAt']}
                            author={comment['author']}
                        />
                    ))}
            </ul>
        );
    }
}

export default Timeline;