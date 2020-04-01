import React from 'react';
import './stylesheets/App.css';
import * as request from './request';
import Editor from './components/Editor';
import Timeline from './components/Timeline';
import { IssueProps, UserProps, CommentProps } from './props';
import Header from './components/Header';

class App extends React.Component<IssueProps, { comments: CommentProps[], me: UserProps, totalCount: number }> {

  constructor(props: IssueProps) {
    super(props);
    this.state = {
      comments: [],
      me: {
        url: '',
        login: '',
        avatarUrl: ''
      },
      totalCount: 0
    }
  }

  comment(text: string) {
    request.post(`repos/${this.props.user}/${this.props.repo}/issues/${this.props.number}/comments`, { body: text })
      .then(() => this.comments())
      .catch(console.error);
  }

  comments() {
    request.get(`repos/${this.props.user}/${this.props.repo}/issues/${this.props.number}/comments`)
      .then(result => {
        this.setState({ comments: result.data.repository.issue.comments.nodes });
        this.setState({ totalCount: result.data.repository.issue.comments.totalCount })
      })
      .catch(console.error);
  }

  me() {
    request.get('user')
      .then(result => {
        this.setState({ me: result.data.viewer })
      })
      .catch(console.log);
  }

  componentDidMount() {
    this.comments();
    this.me();
  }

  render() {
    let tmp = {
      user: this.state.me,
      onComment: this.comment.bind(this)
    };
    return (
      <div>
        <Header commentCount={this.state.totalCount} url={`https://github.com/${this.props.user}/${this.props.repo}/issues/${this.props.number}`}/>
        <Timeline {...this.state.comments} />
        <hr className='separator' />
        <Editor {...tmp} />
      </div>
    )
  }
}

export default App;
