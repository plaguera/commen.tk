import * as React from 'react';
import Markdown from 'react-markdown';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Avatar from './Avatar';
import OptionButton from './OptionButton';
import { EditorProps, EditorState } from '../props';
import env from '../environment';

class Editor extends React.Component<EditorProps, EditorState> {

    private ref = React.createRef<HTMLTextAreaElement>();

    constructor(props: EditorProps) {
        super(props);
        this.state = {
            text: ''
        }
        this.onComment = this.onComment.bind(this);
    }

    handleClick(e: any) {
        this.setState({ text: this.ref.current?.value || '' });
    }

    onComment() {
        this.setState({ text: this.ref.current?.value || '' }, () => {
            this.props.onComment(this.state.text);
            if (this.ref.current) this.ref.current.value = '';
        });
    }

    render() {
        if (this.props.user) {
            return (
                <div className='editor-wrapper'>
                    <Avatar {...this.props.user}/>
                    <div className="editor arrow-box">
                        <Tabs forceRenderTabPanel={true}>
                            <TabList>
                                <Tab>Write</Tab>
                                <Tab onClick={this.handleClick.bind(this)}>Preview</Tab>
                                <OptionButton />
                            </TabList>

                            <TabPanel>
                                <div className="editor-textarea" id="tab-editor">
                                    <textarea placeholder="Leave a comment" id="textarea-comment" ref={this.ref}></textarea>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div className="editor-preview" id="tab-preview">
                                    <div className="markdown-render">
                                        <Markdown source={this.state.text} />
                                    </div>
                                </div>
                            </TabPanel>
                        </Tabs>
                        <div className="editor-buttons">
                            <button className="btn btn-primary" id="btn-comment" onClick={this.onComment}>
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
                                <OptionButton />
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