import React from 'react';
import * as request from './request';
import Editor from './components/Editor';
import Header from './components/Header';
import Timeline from './components/Timeline';
import { WidgetProps, WidgetState } from './props';
import PaginationButton from './components/PaginationButton';

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
			totalCount: 0,
			hiddenItems: 0,
			cursor: ''
		}
		switch (this.props.theme) {
			case 'dark': require('./stylesheets/themes/dark/App'); break;
			case 'light': require('./stylesheets/themes/light/App'); break;
			default: require('./stylesheets/themes/light/App');
		}
	}

	issueUrl() {
		return `https://github.com/${this.props.user}/${this.props.repo}/issues/${this.props.number}`;
	}

	commentsRequestUri(cursor?: string) {
		if (cursor)
			return `comments/${this.props.user}/${this.props.repo}/${this.props.number}/${this.props.pageSize}/${cursor}`;
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
				this.setState({ hiddenItems: this.state.totalCount - this.state.comments.length });
				this.setState({ cursor: data.repository.issue.comments.pageInfo.startCursor });
			})
			.catch(console.error);
	}

	nextComments() {
		request.get(this.commentsRequestUri(this.state.cursor))
			.then(data => {
				this.setState({ comments: data.repository.issue.comments.nodes.concat(this.state.comments) });
				this.setState({ hiddenItems: this.state.totalCount - this.state.comments.length });
				this.setState({ cursor: data.repository.issue.comments.pageInfo.startCursor });
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
		// TODO: comment anchor style
		// TODO: pagination if logged in
		return (
			<div>
				<Header commentCount={this.state.totalCount} url={this.issueUrl()} />
				<div className='timeline-wrapper'>
					<PaginationButton hiddenItems={this.state.hiddenItems} onClick={this.nextComments.bind(this)} />
					<Timeline {...this.state.comments} />
				</div>
				<Editor user={this.state.user} onComment={this.comment.bind(this)} />
			</div>
		)
	}
}

export default Widget;
