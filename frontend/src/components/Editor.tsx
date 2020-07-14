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
    private dragndrop = React.createRef<HTMLInputElement>();

    constructor(props: EditorProps) {
        super(props);
        this.state = {
            text: ''
        }
        this.onComment = this.onComment.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFile = this.handleFile.bind(this);
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

    handleFile() {
        this.dragndrop.current?.click();
    }

    insertAtCursor(value: string) {
        let textarea = this.textarea.current!;
        if (textarea.selectionStart || textarea.selectionStart === 0) {
            var startPos = textarea.selectionStart;
            var endPos = textarea.selectionEnd;
            textarea.value = textarea.value.substring(0, startPos)
                + value
                + textarea.value.substring(startPos, textarea.value.length);
        } else {
            textarea.value += value;
        }
        textarea.focus();
    }

    surroundCursor(value: string) {
        let textarea = this.textarea.current!;
        let begin = textarea.selectionStart;
        let end = textarea.selectionEnd;
        if (textarea.selectionStart || textarea.selectionStart === 0) {
            textarea.value = textarea.value.substring(0, begin)
                + value + textarea.value.substring(begin, end) + value
                + textarea.value.substring(end, textarea.value.length);
        }
        if (begin === end) {
            begin -= value.length;
            end = begin;
        } else {
            begin += 1;
            end += 1;
        }
        textarea.setSelectionRange(begin, end);
        textarea.focus();
    }

    readonly markdownButtons = {
        header: () => this.insertAtCursor('### '),
        bold: () => this.surroundCursor('**'),
        italic: () => this.surroundCursor('_'),
        quote: () => this.insertAtCursor('>'),
        code: () => this.surroundCursor('`'),
        link: () => this.surroundCursor('_'),
        bullet: () => this.surroundCursor('_'),
        number: () => this.surroundCursor('_'),
        task: () => this.surroundCursor('_'),
        mention: () => this.insertAtCursor('@'),
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
                                    <div className='markdown-toolbar'>
                                        <div className='markdown-group'>
                                            <div className='markdown-btn tooltipped tooltipped-above' aria-label='Add header text' id='md-btn-header' onClick={this.markdownButtons.header.bind(this)}>
                                                <svg className="octicon octicon-heading" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M3.75 2a.75.75 0 01.75.75V7h7V2.75a.75.75 0 011.5 0v10.5a.75.75 0 01-1.5 0V8.5h-7v4.75a.75.75 0 01-1.5 0V2.75A.75.75 0 013.75 2z"></path></svg>
                                            </div>
                                            <div className='markdown-btn tooltipped tooltipped-above' aria-label='Add bold text' id='md-btn-bold' onClick={this.markdownButtons.bold.bind(this)}>
                                                <svg className="octicon octicon-bold" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 2a1 1 0 00-1 1v10a1 1 0 001 1h5.5a3.5 3.5 0 001.852-6.47A3.5 3.5 0 008.5 2H4zm4.5 5a1.5 1.5 0 100-3H5v3h3.5zM5 9v3h4.5a1.5 1.5 0 000-3H5z"></path></svg>
                                            </div>
                                            <div className='markdown-btn tooltipped tooltipped-above' aria-label='Add italic text' id='md-btn-italic' onClick={this.markdownButtons.italic.bind(this)}>
                                                <svg className="octicon octicon-italic" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6 2.75A.75.75 0 016.75 2h6.5a.75.75 0 010 1.5h-2.505l-3.858 9H9.25a.75.75 0 010 1.5h-6.5a.75.75 0 010-1.5h2.505l3.858-9H6.75A.75.75 0 016 2.75z"></path></svg>
                                            </div>
                                        </div>
                                        <div className='markdown-group'>
                                            <div className='markdown-btn tooltipped tooltipped-above' aria-label='Insert a quote' id='md-btn-quote' onClick={this.markdownButtons.quote.bind(this)}>
                                                <svg className="octicon octicon-quote" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.75 2.5a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5H1.75zm4 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zM2.5 7.75a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6z"></path></svg>
                                            </div>
                                            <div className='markdown-btn tooltipped tooltipped-above' aria-label='Insert code' id='md-btn-code' onClick={this.markdownButtons.code.bind(this)}>
                                                <svg className="octicon octicon-code" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4.72 3.22a.75.75 0 011.06 1.06L2.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L.47 8.53a.75.75 0 010-1.06l4.25-4.25zm6.56 0a.75.75 0 10-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 101.06 1.06l4.25-4.25a.75.75 0 000-1.06l-4.25-4.25z"></path></svg>
                                            </div>
                                            <div className='markdown-btn tooltipped tooltipped-above' aria-label='Add a link' id='md-btn-link' onClick={this.markdownButtons.link.bind(this)}>
                                                <svg className="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg>
                                            </div>
                                        </div>
                                        <div className='markdown-group'>
                                            <div className='markdown-btn tooltipped tooltipped-above' aria-label='Add a bulleted list' id='md-btn-bullet-list' onClick={this.markdownButtons.bullet.bind(this)}>
                                                <svg className="octicon octicon-list-unordered" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2 4a1 1 0 100-2 1 1 0 000 2zm3.75-1.5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zM3 8a1 1 0 11-2 0 1 1 0 012 0zm-1 6a1 1 0 100-2 1 1 0 000 2z"></path></svg>
                                            </div>
                                            <div className='markdown-btn tooltipped tooltipped-above' aria-label='Add a numbered list' id='md-btn-number-list' onClick={this.markdownButtons.number.bind(this)}>
                                                <svg className="octicon octicon-list-ordered" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.003 2.5a.5.5 0 00-.723-.447l-1.003.5a.5.5 0 00.446.895l.28-.14V6H.5a.5.5 0 000 1h2.006a.5.5 0 100-1h-.503V2.5zM5 3.25a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 015 3.25zm0 5a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 015 8.25zm0 5a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5a.75.75 0 01-.75-.75zM.924 10.32l.003-.004a.851.851 0 01.144-.153A.66.66 0 011.5 10c.195 0 .306.068.374.146a.57.57 0 01.128.376c0 .453-.269.682-.8 1.078l-.035.025C.692 11.98 0 12.495 0 13.5a.5.5 0 00.5.5h2.003a.5.5 0 000-1H1.146c.132-.197.351-.372.654-.597l.047-.035c.47-.35 1.156-.858 1.156-1.845 0-.365-.118-.744-.377-1.038-.268-.303-.658-.484-1.126-.484-.48 0-.84.202-1.068.392a1.858 1.858 0 00-.348.384l-.007.011-.002.004-.001.002-.001.001a.5.5 0 00.851.525zM.5 10.055l-.427-.26.427.26z"></path></svg>
                                            </div>
                                            <div className='markdown-btn tooltipped tooltipped-above' aria-label='Add a task list' id='md-btn-task-list' onClick={this.markdownButtons.task.bind(this)}>
                                                <svg className="octicon octicon-tasklist" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.5 2.75a.25.25 0 01.25-.25h10.5a.25.25 0 01.25.25v10.5a.25.25 0 01-.25.25H2.75a.25.25 0 01-.25-.25V2.75zM2.75 1A1.75 1.75 0 001 2.75v10.5c0 .966.784 1.75 1.75 1.75h10.5A1.75 1.75 0 0015 13.25V2.75A1.75 1.75 0 0013.25 1H2.75zm9.03 5.28a.75.75 0 00-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.5-4.5z"></path></svg>
                                            </div>
                                        </div>
                                        <div className='markdown-group'>
                                            <div className='markdown-btn tooltipped tooltipped-above' aria-label='Directly mention a user or a team ' id='md-btn-mention' onClick={this.markdownButtons.mention.bind(this)}>
                                                <svg className="octicon octicon-mention" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4.75 2.37a6.5 6.5 0 006.5 11.26.75.75 0 01.75 1.298 8 8 0 113.994-7.273.754.754 0 01.006.095v1.5a2.75 2.75 0 01-5.072 1.475A4 4 0 1112 8v1.25a1.25 1.25 0 002.5 0V7.867a6.5 6.5 0 00-9.75-5.496V2.37zM10.5 8a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0z"></path></svg>                                            </div>
                                        </div>
                                    </div>
                                    <div className='textarea-wrapper'>
                                        <textarea placeholder="Leave a comment" id="textarea-comment" ref={this.textarea} onChange={this.handleChange}></textarea>
                                        <div id='drag-n-drop' onClick={this.handleFile}>
                                            <input type='file' ref={this.dragndrop} />
                                            <span>
                                                <span>
                                                    Attach files by dragging &amp; dropping, selecting or pasting them.
                                                </span>
                                            </span>
                                        </div>
                                    </div>
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