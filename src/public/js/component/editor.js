import { Auth } from "../auth";
import { User } from "../types";
import { AUTH_URL } from "../github"

export class EditorComponent {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'editor-wrapper';
        if (Auth.signedIn()) {
            User.me().then(me => {
                this.element.innerHTML = `
                <div class="editor-component-avatar timeline-comment-avatar">
                    <a href="${me.html_url}">
                        <img class="avatar" src="${me.avatar_url}">
                    </a>
                </div>
                <div class="editor-component arrow_box">
                    <div class="tab-nav">
                        <button class="tab-nav-btn active" id="tab-nav-btn-write">Write</button>
                        <button class="tab-nav-btn" id="tab-nav-btn-preview">Preview</button>
                    </div>
                    <div class="editor-textarea tab" id="tab-editor">
                        <textarea placeholder="Leave a comment"></textarea>
                    </div>
                    <div class="editor-preview tab" style="display:none" id="tab-preview">
                        <div class="markdown-render"></div>
                    </div>
                    <div class="editor-buttons">
                        <button class="btn btn-primary">
                            Comment
                        </button>
                    </div>
                </div>`;
                let editor = this.element.getElementsByClassName('editor-textarea')[0].firstChild;
                let render = this.element.getElementsByClassName('markdown-render')[0];
                let tabNavBtns = this.element.getElementsByClassName('tab-nav-btn');
                let tabs = this.element.getElementsByClassName('tab');
                let btnWrite = tabNavBtns.namedItem('tab-nav-btn-write');
                let btnPreview = tabNavBtns.namedItem('tab-nav-btn-preview');

                btnWrite.addEventListener('click', (event) => {
                    if (event.currentTarget.classList.contains('active')) return;
                    btnPreview.classList.remove('active');
                    event.currentTarget.classList.add('active');
                    tabs.namedItem('tab-editor').style.display = 'block';
                    tabs.namedItem('tab-preview').style.display = 'none';
                });

                btnPreview.addEventListener('click', (event) => {
                    if (event.currentTarget.classList.contains('active')) return;
                    if (editor.value.trim() === '') render.innerHTML = 'Nothing to preview';
                    else renderMarkdown(editor.value).then(result => render.innerHTML = result);
                    btnWrite.classList.remove('active');
                    event.currentTarget.classList.add('active');
                    tabs.namedItem('tab-editor').style.display = 'none';
                    tabs.namedItem('tab-preview').style.display = 'block';
                });
            });

        } else {
            this.element.innerHTML = `
            <div class="editor-component">
                <div class="tab-nav">
                    <button class="tab-nav-btn active" id="tab-nav-btn-write">Write</button>
                    <button class="tab-nav-btn cursor-forbidden" id="tab-nav-btn-preview" disabled>Preview</button>
                </div>
                <div class="editor-textarea tab" id="tab-editor">
                    <textarea class="cursor-forbidden" placeholder="Leave a comment" disabled></textarea>
                </div>
                <div class="editor-preview tab" style="display:none" id="tab-preview">
                    <div class="markdown-render"></div>
                </div>
                <div class="editor-buttons">
                <a class="btn btn-primary" href="${AUTH_URL}">
                    Sign In
                </a>
                </div>
            </div>`;
        }
    }
}