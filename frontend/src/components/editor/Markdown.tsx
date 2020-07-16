import React, { Component } from 'react';

interface MarkdownProps { onChange: (value: string) => void, onFile: (value: string) => void }
interface MarkdownStates {}
interface EditorRegExp { char: string, regex: RegExp, surround: boolean }

class Markdown extends Component<MarkdownProps, MarkdownStates> {

    private textarea = React.createRef<HTMLTextAreaElement>();

    readonly regex = {
        header: {
            char: '### ',
            regex: /[#][#][#][\s](.*)/,
            surround: false
        },
        bold: {
            char: '**',
            regex: /[*][*](.*)[*][*]/,
            surround: true
        },
        italic: {
            char: '_',
            regex: /[_](.*)[_]/,
            surround: true
        },
        quote: {
            char: '> ',
            regex: /[\n]?[>][ ]([^\n]+)[\n]?/g,
            surround: false
        },
        code: {
            char: '`',
            regex: /[`](.*)[`]/,
            surround: true
        },
        bullet: {
            char: '- ',
            regex: /[\n]?[-][ ]([^\n]+)[\n]?/g,
            surround: false
        },
        number: {
            char: '1. ',
            regex: /[\n]?[\d]+[.][ ]([^\n]+)[\n]?/g,
            surround: false
        },
        task: {
            char: '- [ ] ',
            regex: /[\n]?[-][ ][\[][ ][\]][ ]([^\n]+)[\n]?/g,
            surround: false
        },
        mention: {
            char: '@',
            regex: /[@](.*)/,
            surround: false
        }
    }
    
    readonly markdownButtons = {
        header: () => this.addMarkdownFormat(this.regex.header),
        bold: () => this.addMarkdownFormat(this.regex.bold),
        italic: () => this.addMarkdownFormat(this.regex.italic),
        quote: () => this.addMarkdownFormatMultiline(this.regex.quote),
        code: () => this.addMarkdownFormat(this.regex.code),
        link: () => this.link(),
        bullet: () => this.addMarkdownFormatMultiline(this.regex.bullet),
        number: () => this.addMarkdownFormatMultiline(this.regex.number),
        task: () => this.addMarkdownFormatMultiline(this.regex.task),
        mention: () => this.addMarkdownFormat(this.regex.mention),
    }

    hasSelection() {
        let textarea = this.textarea.current!;
        let begin = textarea.selectionStart;
        let end = textarea.selectionEnd;
        return begin !== end;
    }

    selectionMatches(selector: EditorRegExp) {
        let textarea = this.textarea.current!;
        let begin = textarea.selectionStart;
        let end = textarea.selectionEnd;
        let selection;
        if (selector.surround) {
            selection = textarea.value.substring(begin - selector.char.length, end + selector.char.length);
        } else {
            selection = textarea.value.substring(begin - selector.char.length, end);
        }
        return selection.match(selector.regex);
    }

    selectionMatchesMultiline(selector: EditorRegExp) {
        let textarea = this.textarea.current!;
        let begin = textarea.selectionStart;
        let end = textarea.selectionEnd;
        return textarea.value.substring(begin, end).match(selector.regex);
    }

    addMarkdownFormat(regex: EditorRegExp) {
        let textarea = this.textarea.current!;
        let begin = textarea.selectionStart;
        let end = textarea.selectionEnd;
        if (!this.hasSelection()) {
            let cursor = begin;
            if (regex.surround)
                textarea.value = textarea.value.slice(0, cursor) + regex.char + regex.char + textarea.value.slice(cursor);
            else
                textarea.value = textarea.value.slice(0, cursor) + regex.char + textarea.value.slice(cursor);
            begin += regex.char.length;
            end += regex.char.length;
        } else if (this.selectionMatches(regex)) {
            if (regex.surround) {
                textarea.value = textarea.value.slice(0, begin - regex.char.length) + textarea.value.substring(begin, end) + textarea.value.slice(end + regex.char.length);
            } else {
                textarea.value = textarea.value.slice(0, begin - regex.char.length) + textarea.value.substring(begin, end);
            }
            begin -= regex.char.length;
            end -= regex.char.length;
        } else {
            if (regex.surround)
                textarea.value = textarea.value.slice(0, begin) + regex.char + textarea.value.substring(begin, end) + regex.char + textarea.value.slice(end);
            else
                textarea.value = textarea.value.slice(0, begin) + regex.char + textarea.value.substring(begin, end) + textarea.value.slice(end);
            begin += regex.char.length;
            end += regex.char.length;
        }
        textarea.setSelectionRange(begin, end);
        textarea.focus();
    }

    addMarkdownFormatMultiline(regex: EditorRegExp) {
        let textarea = this.textarea.current!;
        let begin = textarea.selectionStart;
        let end = textarea.selectionEnd;
        if (!this.hasSelection()) {
            let cursor = begin;
            let length = textarea.value.length;
            if (textarea.value.length === 0)
                textarea.value = regex.char;
            else if (textarea.value.substring(0, cursor).endsWith('\n\n'))
                textarea.value = textarea.value.slice(0, cursor) + regex.char + textarea.value.slice(cursor);
            else if (textarea.value.substring(0, cursor).endsWith('\n'))
                textarea.value = textarea.value.slice(0, cursor) + '\n' + regex.char + textarea.value.slice(cursor);
            else
                textarea.value = textarea.value.slice(0, cursor) + '\n\n' + regex.char + textarea.value.slice(cursor);
            begin += textarea.value.length - length;
            end += textarea.value.length - length;
        } else if (this.selectionMatchesMultiline(regex)) {
            let selected = textarea.value.substring(begin, end);
            let length = selected.length;
            let tmp = selected.split(regex.char).join('');
            textarea.value = textarea.value.slice(0, begin) + tmp + textarea.value.slice(end);
            //begin -= length - tmp.length;
            end -= length - tmp.length;
        } else {
            let match, re = /([^\n]+)[\n]?/g, tmp = '', length = 0;
            while (match = re.exec(textarea.value.substring(begin, end))) {
                tmp += regex.char + match[1] + '\n';
                length += regex.char.length;
            }
            tmp = tmp.slice(0, -1);
            textarea.value = textarea.value.slice(0, begin) + tmp + textarea.value.slice(end);
            //begin -= regex.char.length;
            end += length;
        }
        textarea.setSelectionRange(begin, end);
        textarea.focus();
    }

    link() {
        let textarea = this.textarea.current!;
        let begin = textarea.selectionStart;
        let end = textarea.selectionEnd;
        if (!this.hasSelection()) {
            let cursor = begin;
            let tmp = '[](url)';
            textarea.value = textarea.value.slice(0, cursor) + tmp + textarea.value.slice(cursor);
            begin += 1;
            end += 1;
        } else {
            textarea.value = textarea.value.slice(0, begin) + '[' + textarea.value.substring(begin, end) + '](url)' + textarea.value.slice(end);
            begin += textarea.value.substring(begin, end).length + 3;
            end += 6;
        }
        textarea.setSelectionRange(begin, end);
        textarea.focus();
    }

    constructor(props: MarkdownProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleFile = this.handleFile.bind(this);
    }

    handleChange() {
        this.props.onChange(this.textarea.current?.value || '');
    }

    handleFile() {
        this.props.onFile('');
    }

    render() {
        return (
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
                    <div id='drag-n-drop'>
                        <span></span>
                        <span className='tooltipped tooltipped-above' aria-label='Styling with Markdown is supported'>
                            <a href='https://guides.github.com/features/mastering-markdown/' target='_blank'>
                                <svg className="octicon octicon-markdown v-align-bottom" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z"></path></svg>
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        );
    }

}
/*
<input type='file' accept=".gif,.jpeg,.jpg,.png,.docx,.gz,.log,.pdf,.pptx,.txt,.xlsx,.zip" />
                        <span>
                            <span>
                                Attach files by dragging &amp; dropping, selecting or pasting them.
                                                </span>
                        </span>
*/
export default Markdown;