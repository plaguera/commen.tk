import React, { Component } from 'react';
import env from '../environment';

class OptionButton extends Component {

	private ref = React.createRef<HTMLDetailsElement>();

	constructor() {
		super({});
	}

	handleClickOutside = (event: any) => {
		if (this.ref.current && !this.ref.current.contains(event.target)) {
			this.ref.current.removeAttribute('open');
		}
	};

	componentDidMount() {
		document.addEventListener("mousedown", this.handleClickOutside);
	}
	componentWillUnmount() {
		document.removeEventListener("mousedown", this.handleClickOutside);
	}

	render() {
		return (
			<details className='btn-option-wrapper' ref={this.ref}>
				<summary className='btn-option'>
					<svg aria-label="Show options" className="octicon octicon-kebab-horizontal" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path d="M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm13 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>
				</summary>
				<div className='details-menu'>
					<form action={env.url_api + 'logout/'}>
						<button className='btn-danger' type='submit'>Log out</button>
					</form>
				</div>
			</details>
		);
	}
}

export default OptionButton