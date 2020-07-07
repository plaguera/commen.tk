import * as React from 'react';
import { UserProps } from '../props';

class Avatar extends React.Component<UserProps, {}> {
    render() {
        return (
            <div className='avatar-wrapper'>
                <a className='avatar-link' href={this.props.url}>
                    <img className='avatar-img' src={this.props.avatarUrl} alt={this.props.login} />
                </a>
            </div>
        );
    }
}

export default Avatar;