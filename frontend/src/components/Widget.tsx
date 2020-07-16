import React from 'react';
import Editor from './editor/Editor';
import Header from './Header';
import Timeline from './Timeline';
import { WidgetState, WidgetProps } from '../props';
import PaginationButton from './PaginationButton';

import agent from '../agent';
import env from '../environment';

class Widget extends React.Component<WidgetProps, WidgetState> {

	constructor(props: WidgetProps) {
		super(props);
		this.state = {
			comments: [],
			cursor: undefined,
			hiddenItems: 0,
			init: false,
			issue: {
				author: '',
				number: this.props.issue.number,
				url: this.props.issue.number != -1 ? `https://github.com/${env.attributes.repo}/issues/${this.props.issue.number}` : ''
			},
			totalCount: 0,
			viewer: undefined
		}
	}

	async checkIssueNumber() {
		if (this.state.issue.number == -1) {
			let name = '';
			switch (this.props.issue.name) {
				case 'hostname': name = window.location.hostname; break;
				case 'pathname': name = window.location.pathname; break;
				case 'title': name = document.title; break;
				default: break;
			}
			let data = await agent.Issues.number(name);
			this.updateIssueStates(data);
		}
	}

	updateIssueStates(data: any) {
		env.attributes.issue.number = data.number;
		this.setState({ issue: { ...this.state.issue, number: data.number } });
		this.setState({ issue: { ...this.state.issue, url: data.url } });
	}

	setCommentStates(data: any) {
		this.setState({ issue: { ...this.state.issue, author: data.repository.issue.author.login } });
		this.setState({ comments: data.repository.issue.comments.nodes });
		this.setState({ totalCount: data.repository.issue.comments.totalCount });
		this.setState({ hiddenItems: data.repository.issue.comments.totalCount - data.repository.issue.comments.nodes.length });
		this.setState({ cursor: data.repository.issue.comments.pageInfo.startCursor });
	}

	updateCommentStates(data: any) {
		this.setState({ comments: data.repository.issue.comments.nodes.concat(this.state.comments) });
		this.setState({ totalCount: data.repository.issue.comments.totalCount });
		this.setState({ hiddenItems: data.repository.issue.comments.totalCount - data.repository.issue.comments.nodes.length - this.state.comments.length });
		this.setState({ cursor: data.repository.issue.comments.pageInfo.startCursor });
	}

	comments() {
		agent.Issues
			.comments()
			.then(data => this.setCommentStates(data))
	}

	nextComments() {
		agent.Issues
			.comments(this.state.cursor)
			.then(data => this.updateCommentStates(data))
	}

	createComment(text: string) {
		agent.Comments
			.create(text)
			.then(() => this.comments());
	}

	deleteComment(id: string) {
		agent.Comments
			.delete(id)
			.then(() => this.comments());
	}

	signout() {
		agent.Actions
			.signout()
			.then(() => { this.comments(); this.user(); });
	}

	user() {
		agent.Users
			.viewer()
			.then((data: any) => { this.setState({ viewer: data.viewer }); this.setState({ init: true }); });
	}

	componentDidMount() {
		this.checkIssueNumber().then(() => { this.user(); this.comments(); } );
	}

	render() {
		if (!this.state.init) return (null);
		return (
			<div className='widget-wrapper'>
				<Header commentCount={this.state.totalCount} url={this.state.issue.url} />
				<div className='timeline-wrapper'>
					<PaginationButton hiddenItems={this.state.hiddenItems} onClick={this.nextComments.bind(this)} user={this.state.viewer!} />
					<Timeline comments={this.state.comments} onCommentDelete={this.deleteComment.bind(this)} issueAuthor={this.state.issue.author} />
				</div>
				<Editor viewer={this.state.viewer!} onComment={this.createComment.bind(this)} onSignOut={this.signout.bind(this)} />
			</div>
		);
	}
}
export default Widget;
