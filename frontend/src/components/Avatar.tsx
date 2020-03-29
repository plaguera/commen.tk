import * as React from 'react';
import * as request from '../request';
import '../stylesheets/components/avatar.scss';

interface AvatarProps { user: string; }


class Avatar extends React.Component<AvatarProps, {}> {

    state = {
        user: {
            login: '',
            url: '',
            avatarUrl: ''
        }
    }

    componentDidMount() {
        if (this.props.user != 'me') {
            request.get(`users/${this.props.user}`)
            .then(result => {
                this.setState({ user: result.data.user })
            })
            .catch(console.log);
        } else {
            request.get('user')
            .then(result => {
                this.setState({ user: result.data.viewer })
            })
            .catch(console.log);
        }
    }

    render() {
        return (
            <div className="avatar-wrapper">
                <a className="avatar-link" href={this.state.user.url}>
                    <img className="avatar-img" src={this.state.user.avatarUrl} alt={this.state.user.login} />
                </a>
            </div>
        );

    }
}

export default Avatar;