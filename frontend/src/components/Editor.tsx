import * as React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Avatar from './Avatar';
import { EditorProps, EditorState } from '../props';
import DetailsMenu from './DetailsMenu';
import agent from '../agent';
import env from '../environment';

class Editor extends React.Component<EditorProps, EditorState> {

    private textarea = React.createRef<HTMLTextAreaElement>();
    private commentBtn = React.createRef<HTMLButtonElement>();

    constructor(props: EditorProps) {
        super(props);
        this.state = {
            text: ''
        }
        this.onComment = this.onComment.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleClick(e: any) {
        agent.GitHub
            .markdown(this.textarea.current?.value || '')
            .then(text => this.setState({ text: text || '' }));
    }

    onComment() {
        this.setState({ text: this.textarea.current?.value || '' }, () => {
            this.props.onComment(this.state.text);
            if (this.textarea.current) this.textarea.current.value = '';
        });
    }

    handleChange() {
        let chars = this.textarea.current?.value.length || 0;
        let disabled = this.commentBtn.current?.hasAttribute('disabled');
        if (chars > 0 && disabled) this.commentBtn.current?.removeAttribute('disabled');
        else if (chars === 0 && !disabled) this.commentBtn.current?.setAttribute('disabled', 'true');
    }

    /*

    <a href='https://guides.github.com/features/mastering-markdown/'>
                                            <span>
                                                <svg className="octicon octicon-markdown v-align-bottom" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z"></path></svg>
                                            </span>
                                        </a>

                                        */

    render() {
        if (this.props.viewer) {
            return (
                <div className='editor-wrapper'>
                    <Avatar {...this.props.viewer} />
                    <div className="editor arrow-box">
                        <Tabs forceRenderTabPanel={true}>
                            <TabList>
                                <Tab>Write</Tab>
                                <Tab onClick={this.handleClick.bind(this)}>Preview</Tab>
                                <DetailsMenu>
                                    <button className='btn-danger' onClick={this.props.onSignout}>Sign out</button>
                                </DetailsMenu>
                            </TabList>

                            <TabPanel>
                                <div className="editor-textarea" id="tab-editor">
                                    <textarea placeholder="Leave a comment" id="textarea-comment" ref={this.textarea} onChange={this.handleChange}></textarea>
                                    <label>
                                        <span>
                                            <span>
                                                Attach files by dragging &amp; dropping, selecting or pasting them.
                                            </span>
                                        </span>
                                        
                                    </label>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div className="editor-preview" id="tab-preview">
                                    <div className="markdown-render">
                                        {ReactHtmlParser(this.state.text !== '' ? this.state.text : '<p>Nothing to preview</p>')}
                                    </div>
                                </div>
                            </TabPanel>
                        </Tabs>
                        <div className="editor-buttons">
                            <button className="btn btn-primary" id="btn-comment" onClick={this.onComment} ref={this.commentBtn} disabled>
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
                            <a className="btn btn-primary" href={env.url_api + 'authorize/'}>
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