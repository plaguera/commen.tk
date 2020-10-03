import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { UserProps } from '../../props';
import Avatar from '../Avatar';
import DetailsMenu from '../DetailsMenu';
import Markdown from './Markdown';
import Preview from './Preview';
import env from '../../environment';

interface EditorProps { viewer: UserProps, onComment: (value: string) => void, onSignOut: () => void }
interface EditorStates { text: string }

class Editor extends Component<EditorProps, EditorStates> {

    private preview = React.createRef<Preview>();

    constructor(props: EditorProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleFile = this.handleFile.bind(this);
    }

    handleChange(value: string) {
        this.setState({ text: value });
    }

    handleFile(value: string) {

    }

    handleClick() {
        this.props.onComment(this.state.text);
    }

    render() {
        if (this.props.viewer) {
            return (
                <div className='editor-wrapper login'>
                    <Avatar {...this.props.viewer} />
                    <div className='editor arrow-box'>
                        <Tabs forceRenderTabPanel={true}>
                            <TabList>
                                <Tab>Write</Tab>
                                <Tab onClick={() => this.preview.current?.renderMarkdown()}>Preview</Tab>
                                <DetailsMenu>
                                    <button className='dropdown-item dropdown-danger' onClick={this.props.onSignOut}>Sign Out</button>
                                </DetailsMenu>
                            </TabList>
                            <TabPanel>
                                <Markdown onChange={this.handleChange} onFile={this.handleFile} />
                            </TabPanel>
                            <TabPanel>
                                <Preview text={this.state.text} ref={this.preview} />
                            </TabPanel>
                            <div className='editor-buttons'>
                                <button className='btn btn-primary' id='btn-comment' onClick={this.handleClick} disabled>
                                    Comment
                            </button>
                            </div>
                        </Tabs>
                    </div>
                </div>
            );
        } else {
            return (
                <div className='editor-wrapper no-login'>
                    <a rel='nofollow' className='btn btn-primary' href='/join?source=comment-repo'>Sign up for free</a>
                    <strong> to join this conversation on GitHub</strong>. Already have an account? <a className='link' rel='nofollow' href={env.url_api + 'authorize/'}>Sign in to comment</a>
                </div>
            );
        }
    }
}

export default Editor;