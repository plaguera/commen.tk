import * as React from 'react';
import Markdown from 'react-markdown';
import * as request from '../request';
import '../stylesheets/components/editor.scss';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Avatar from './Avatar';

const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://plaguera-github-comments.herokuapp.com/' : 'http://localhost:8000/';
const AUTH_URL = BASE_URL + 'authorize/';

function getCookie(name: string) {
    var re = new RegExp('[; ]' + name + '=([^\\s;]*)');
    var sMatch = (' ' + document.cookie).match(re);
    if (name && sMatch) return JSON.parse(unescape(sMatch[1]));
    return;
}

interface Issue {
    user: string;
    repo: string;
    number: number;
}

class Editor extends React.Component<Issue, {}> {

    private textareaRef = React.createRef<HTMLTextAreaElement>();

    state = {
        textareaValue: ''
    }

    handleClick(e: any) {
        this.setState({textareaValue: this.textareaRef.current?.value});
    }

    comment(e: any) {
        request.post(`repos/${this.props.user}/${this.props.repo}/issues/${this.props.number}/comments`, { body: this.textareaRef.current?.value })
            .then(result => {
                console.log(result);
            })
            .catch(console.log);
    }

    render() {
        if (getCookie('loggedin')) {
            return (
                <div className='editor-wrapper'>
                    <Avatar user="me"/>
                    <div className="editor arrow-box">
                        <Tabs forceRenderTabPanel={true}>
                            <TabList>
                                <Tab>Write</Tab>
                                <Tab onClick={this.handleClick.bind(this)}>Preview</Tab>
                            </TabList>

                            <TabPanel>
                                <div className="editor-textarea" id="tab-editor">
                                    <textarea placeholder="Leave a comment" id="textarea-comment" ref={this.textareaRef}></textarea>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div className="editor-preview" id="tab-preview">
                                    <div className="markdown-render">
                                        <Markdown source={this.state.textareaValue} />
                                    </div>
                                </div>
                            </TabPanel>
                        </Tabs>
                        <div className="editor-buttons">
                            <button className="btn btn-primary" id="btn-comment" onClick={this.comment.bind(this)}>
                                Comment
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className='editor-wrapper'>
                    <div className='editor'>
                        <Tabs>
                            <TabList>
                                <Tab>Write</Tab>
                                <Tab disabled>Preview</Tab>
                            </TabList>

                            <TabPanel>
                                <div className="editor-textarea" id="tab-editor">
                                    <textarea placeholder="Leave a comment" disabled></textarea>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div className="editor-preview" id="tab-preview">
                                    <div className="markdown-render"></div>
                                </div>
                            </TabPanel>
                        </Tabs>
                        <div className="editor-buttons">
                            <a className="btn btn-primary" href={AUTH_URL}>
                                Sign In
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

    }
}

export default Editor