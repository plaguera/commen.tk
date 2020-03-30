import React from 'react';
import './App.css';
import * as request from './request';
import Editor from './components/Editor';
import Timeline from './components/Timeline';
import { IssueProps, UserProps, CommentProps } from './props';

class App extends React.Component<IssueProps, { commentsList: CommentProps[], me: UserProps }> {
  
  constructor(props: IssueProps) {
    super(props);
    this.state = {
      commentsList: [],
      me: {
        url: '',
        login: '',
        avatarUrl: ''
      } 
    }
  }

  comment(e: any) {
    request.post(`repos/${this.props.user}/${this.props.repo}/issues/${this.props.number}/comments`, { body: 'texto' })
      .then(result => {
        console.log(result);
      })
      .catch(console.error);
  }

  comments() {
    request.get(`repos/${this.props.user}/${this.props.repo}/issues/${this.props.number}/comments`)
      .then(result => {
        this.setState({ commentsList: result.data.repository.issue.comments.nodes })
        console.log(this.state.commentsList)
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
      commentFunction: this.comment
    };
    return (
      <div>
        <Timeline {...this.state.commentsList}/>
        <hr className='separator' />
        <Editor {...tmp} />
      </div>
    )
  }
}

export default App;
