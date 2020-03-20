import { Github } from "../github";
import { Comment, Issue } from "../types"
import { CommentComponent } from "./comment"

export class TimelineComponent {
    constructor() {
        TimelineComponent.instance = this;
        this.element = document.createElement('div');
        this.element.className = 'timeline-component';
        this.comments = document.createElement('div');
        this.comments.className = 'comment-list';
        this.element.appendChild(this.comments);

        //this.loadIssue('plaguera', 'tfm-testing', 1);
    }

    loadIssue(user, repo, issueNumber) {
        Github.issue(user, repo, issueNumber).then(issue => {
            this.comments.innerHTML = '';
            new Issue(issue).comments().then(result => {
                for (let comment of result)
                    this.comments.appendChild(new CommentComponent(new Comment(comment)).element);
            });
        })
    }
}