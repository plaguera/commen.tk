import React from 'react';
import Editor from './Editor';
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
			issue: {
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

	updateCommentStates(data: any) {
		this.setState({ comments: this.state.cursor ? data.repository.issue.comments.nodes.concat(this.state.comments) : data.repository.issue.comments.nodes });
		this.setState({ totalCount: data.repository.issue.comments.totalCount });
		this.setState({ hiddenItems: data.repository.issue.comments.totalCount - data.repository.issue.comments.nodes.length - this.state.comments.length });
		this.setState({ cursor: data.repository.issue.comments.pageInfo.startCursor });
	}

	comments() {
		agent.Issues
			.comments(this.state.cursor)
			.then(data => this.updateCommentStates(data))
	}

	comment(text: string) {
		agent.Comments
			.create(text)
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
			.then((data: any) => this.setState({ viewer: data.viewer }));
	}

	componentDidMount() {
		this.checkIssueNumber().then(() => {
			this.user();
			this.comments();
		});
	}

	render() {
		return (
			<div className='widget-wrapper'>
				<Header commentCount={this.state.totalCount} url={this.state.issue.url} />
				<div className='timeline-wrapper'>
					<PaginationButton hiddenItems={this.state.hiddenItems} onClick={this.comments.bind(this)} user={this.state.viewer!} />
					<Timeline {...this.state.comments} />
				</div>
				<Editor viewer={this.state.viewer!} onComment={this.comment.bind(this)} onSignout={this.signout.bind(this)} />
			</div>
		);
	}
}

export default Widget;
