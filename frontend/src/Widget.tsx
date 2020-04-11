import React from 'react';
import * as request from './request';
import Editor from './components/Editor';
import Header from './components/Header';
import Timeline from './components/Timeline';
import { WidgetProps, WidgetState } from './props';

class Widget extends React.Component<WidgetProps, WidgetState> {

	constructor(props: WidgetProps) {
		super(props);
		this.state = {
			comments: [],
			user: {
				url: '',
				login: '',
				avatarUrl: ''
			},
			totalCount: 0
		}
		switch(this.props.theme) {
			case 'dark': require('./stylesheets/themes/dark/App'); break;
			case 'light': require('./stylesheets/themes/light/App'); break;
			default: require('./stylesheets/themes/light/App');
		}
	}

	issueUrl() {
		return `https://github.com/${this.props.user}/${this.props.repo}/issues/${this.props.number}`;
	}

	commentsRequestUri() {
		return `comments/${this.props.user}/${this.props.repo}/${this.props.number}/${this.props.pageSize}`;
	}

	comment(text: string) {
		request.post(this.commentsRequestUri(), { body: text })
			.then(() => this.comments())
			.catch(console.error);
	}

	comments() {
		request.get(this.commentsRequestUri())
			.then(data => {
				this.setState({ comments: data.repository.issue.comments.nodes });
				this.setState({ totalCount: data.repository.issue.comments.totalCount });
			})
			.catch(console.error);
	}

	user() {
		request.get('user')
			.then(data => this.setState({ user: data.viewer }))
			.catch(console.error);
	}

	componentDidMount() {
		this.user();
		this.comments();
	}

	render() {
		return (
			<div>
				<Header commentCount={this.state.totalCount} url={this.issueUrl()} />
				<Timeline {...this.state.comments} />
				<Editor user={this.state.user} onComment={this.comment.bind(this)}/>
			</div>
		)
	}
}

export default Widget;
