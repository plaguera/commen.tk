import { CommentAuthorAssociation, Issue } from './github';

const displayAssociations: Record<CommentAuthorAssociation, string> = {
  COLLABORATOR: 'Collaborator',
  CONTRIBUTOR: 'Contributor',
  MEMBER: 'Member',
  OWNER: 'Owner',
  FIRST_TIME_CONTRIBUTOR: 'First time contributor',
  FIRST_TIMER: 'First timer',
  NONE: ''
};

export class CommentComponent {
    public readonly element: HTMLElement;

    constructor(public comment: Issue) {
        const { user, html_url, created_at, body, author_association } = comment;
        this.element = document.createElement('article');
        this.element.classList.add('timeline-comment');
        const association = displayAssociations[author_association];
        this.element.innerHTML = `
        <a class="avatar" href="${user.html_url}" target="_blank" tabindex="-1">
          <img alt="@${user.login}" height="44" width="44"
                src="${user.avatar_url}">
        </a>
        <div class="comment">
          <header class="comment-header">
            <span class="comment-meta">
              <a class="text-link" href="${user.html_url}" target="_blank"><strong>${user.login}</strong></a>
              commented
              <a class="text-link" href="${html_url}" target="_blank">${created_at}</a>
            </span>
            <div class="comment-actions">
              ${association ? `<span class="author-association-badge">${association}</span>` : ''}
            </div>
          </header>
          <div class="markdown-body markdown-body-scrollable">
            ${body}
          </div>
        </div>`;

        const markdownBody = this.element.querySelector('.markdown-body')!;
        const emailToggle = markdownBody.querySelector('.email-hidden-toggle a') as HTMLAnchorElement;
        if (emailToggle) {
            const emailReply = markdownBody.querySelector('.email-hidden-reply') as HTMLDivElement;
            emailToggle.onclick = event => {
                event.preventDefault();
                emailReply.classList.toggle('expanded');
            };
        }
    }
}