import * as React from 'react';
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

class Editor extends React.Component {

    render() {
        if (getCookie('loggedin')) {
            return (
                <div className='editor-wrapper'>
                    <Avatar user="me"/>
                    <div className="editor arrow-box">
                        <Tabs>
                            <TabList>
                                <Tab>Write</Tab>
                                <Tab>Preview</Tab>
                            </TabList>

                            <TabPanel>
                                <div className="editor-textarea" id="tab-editor">
                                    <textarea placeholder="Leave a comment" id="textarea-comment"></textarea>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div className="editor-preview" id="tab-preview">
                                    <div className="markdown-render">
                                        <p>Nothing to preview...</p>
                                    </div>
                                </div>
                            </TabPanel>
                        </Tabs>
                        <div className="editor-buttons">
                            <button className="btn btn-primary" id="btn-comment">
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