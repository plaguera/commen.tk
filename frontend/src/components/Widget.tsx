import React from 'react';
import Editor from './Editor';
import Header from './Header';
import Timeline from './Timeline';
import { Attributes, WidgetState, WidgetProps } from '../props';
import PaginationButton from './PaginationButton';

import agent from '../agent';
import env from '../environment';

class Widget extends React.Component<WidgetProps, WidgetState> {

	constructor(props: WidgetProps) {
		super(props);
		this.state = {
			comments: [],
			issue: {
				number: this.props.issue.number,
				url: this.props.issue.number != -1 ? `https://github.com/${env.attributes.repo}/issues/${this.props.issue.number}` : ''
			},
			viewer: undefined,
			pagination: {
				totalCount: 0,
				hiddenItems: 0,
				cursor: ''
			}
		}
	}

	checkIssueNumber() {
		if (this.state.issue.number == -1) {
			let name = '';
			switch (this.props.issue.name) {
				case 'hostname': name = window.location.hostname; break;
				case 'pathname': name = window.location.pathname; break;
				case 'title': name = document.title; break;
				default: break;
			}
			agent.Issues
				.number(name)
				.then(this.updateIssueStates);
		}
	}

	updateIssueStates(data: any) {
		this.setState({ issue: data });
	}

	updateCommentStates(data: any) {
		this.setState({ comments: data.repository.issue.comments.nodes });
		this.setState({ pagination: { ...this.state.pagination, totalCount: data.repository.issue.comments.totalCount } });
		this.setState({ pagination: { ...this.state.pagination, hiddenItems: this.state.pagination.totalCount - this.state.comments.length } });
		this.setState({ pagination: { ...this.state.pagination, cursor: data.repository.issue.comments.pageInfo.startCursor } });
	}

	comment(text: string) {
		agent.Comments
			.create(text)
			.then(this.comments);
	}

	comments() {
		agent.Issues
			.comments(this.state.pagination.cursor)
			.then(this.updateCommentStates)
			.finally(() => { this.setState({ pagination: { ...this.state.pagination, hiddenItems: this.state.pagination.totalCount - this.state.comments.length } }); });
	}

	logout() {
		agent.Actions
			.signout()
			.then(() => { this.comments(); this.user(); });
	}

	user() {
		agent.Users
			.viewer()
			.then(data => this.setState({ viewer: data.viewer }));
	}

	componentDidMount() {
		this.checkIssueNumber();
		this.user();
		this.comments();
	}

	render() {
		return (
			<div className='widget-wrapper'>
				<Header commentCount={this.state.pagination.totalCount} url={this.props.issue.url} />
				<div className='timeline-wrapper'>
					<PaginationButton hiddenItems={this.state.pagination.hiddenItems} onClick={this.nextComments.bind(this)} user={this.state.viewer!} />
					<Timeline {...this.state.comments} />
				</div>
				<Editor user={this.state.viewer!} onComment={this.comment.bind(this)} onLogout={this.logout.bind(this)} />
			</div>
		);
	}
}

export default Widget;
