import React from 'react';
import * as request from './request';
import Editor from './components/Editor';
import Header from './components/Header';
import Timeline from './components/Timeline';
import { WidgetProps, WidgetState } from './props';
import Util from './util';

class Widget extends React.Component<WidgetProps, WidgetState> {

	constructor(props: WidgetProps) {
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
		switch(this.props.theme) {
			case 'dark': require('./stylesheets/themes/dark/App'); break;
			default: require('./stylesheets/themes/light/App');
		}
	}

	issueUrl() {
		return `https://github.com/${this.props.user}/${this.props.repo}/issues/${this.props.number}`;
	}

	commentsRequestUri() {
		return `repos/${this.props.user}/${this.props.repo}/issues/${this.props.number}/comments`;
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

	me() {
		request.get('user')
			.then(data => this.setState({ me: data.viewer }))
			.catch(console.error);
	}

	componentDidMount() {
		if (Util.loggedIn()) this.me();
		this.comments();
	}

	render() {
		let tmp = {
			user: this.state.me,
			onComment: this.comment.bind(this)
		};
		return (
			<div>
				<Header commentCount={this.state.totalCount} url={this.issueUrl()} />
				<Timeline {...this.state.comments} />
				<Editor {...tmp} />
			</div>
		)
	}
}

export default Widget;
