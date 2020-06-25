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
			issue: this.props.issuenumber,
			user: undefined,
			totalCount: 0,
			hiddenItems: 0,
			cursor: ''
		}
	}

	async issue() {
		if (this.state.issue == -1) {
			let name = '';
			switch(this.props.issuename) {
				case 'url': name = window.location.href; break;
				case 'title': name = document.title; break;
				default: break;
			}
			let res = await request.get(`issuenumber/${this.props.owner}/${this.props.repo}/${name}`).catch(console.error);
			this.setState({ issue: res.search.nodes[0].number })
			return res;
		}
	}

	issueUrl() {
		return `https://github.com/${this.props.owner}/${this.props.repo}/issues/${this.state.issue}`;
	}

	commentsRequestUri(cursor?: string) {
		if (cursor)
			return `comments/${this.props.owner}/${this.props.repo}/${this.state.issue}?pagesize=${this.props.pageSize}&cursor=${cursor}`;
		return `comments/${this.props.owner}/${this.props.repo}/${this.state.issue}?pagesize=${this.props.pageSize}`;
	}

	comment(text: string) {
		request.post(this.commentsRequestUri(), { body: text })
			.then(() => this.comments())
			.catch(console.error);
	}

	comments() {
		request.get(this.commentsRequestUri())
			.then(data => {
				console.log(data);
				this.setState({ comments: data.repository.issue.comments.nodes });
				this.setState({ totalCount: data.repository.issue.comments.totalCount });
				this.setState({ hiddenItems: this.state.totalCount - this.state.comments.length });
				this.setState({ cursor: data.repository.issue.comments.pageInfo.startCursor });
			})
			// Required for Preact to set state properly
			.finally(() => { this.setState({ hiddenItems: this.state.totalCount - this.state.comments.length }); })
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
		this.issue().then(() => {
			this.user();
			this.comments();
		});
	}

	render() {
		return (
			<div className='widget-wrapper'>
				<Header commentCount={this.state.totalCount} url={this.issueUrl()} />
				<div className='timeline-wrapper'>
					<PaginationButton hiddenItems={this.state.hiddenItems} onClick={this.nextComments.bind(this)} user={this.state.user!}/>
					<Timeline {...this.state.comments} />
				</div>
				<Editor user={this.state.user!} onComment={this.comment.bind(this)} />
			</div>
		);
	}
}

export default Widget;
