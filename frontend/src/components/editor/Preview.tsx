import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';
import agent from '../../agent';

interface PreviewProps { text: string }
interface PreviewStates { html: string }

class Preview extends Component<PreviewProps, PreviewStates> {

    renderMarkdown() {
        if (!this.props.text || this.props.text === '') this.setState({ html: '<p>Nothing to preview</p>' });
        else
            agent.GitHub
                .markdown(this.props.text)
                .then(html => this.setState({ html: html || '<p>Nothing to preview</p>' }));
    }

    render() {
        return (
            <div className='editor-preview' id='tab-preview'>
                <div className='markdown-render'>
                    {ReactHtmlParser(this.state.html)}
                </div>
            </div>
        );
    }
}

export default Preview;