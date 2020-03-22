import { Comment, Issue } from "../types"
import { CommentComponent } from "./comment"
import { CommentWidget } from "../comment-widget";

export class TimelineComponent {
    constructor() {
        TimelineComponent.instance = this;
        this.element = document.createElement('div');
        this.element.className = 'timeline-component';
        this.comments = document.createElement('div');
        this.comments.className = 'comment-list';
        this.element.appendChild(this.comments);
        this.reload();
    }

    reload() {
        CommentWidget.issue.comments().then(comments => {
            this.comments.innerHTML = '';
            for (let comment of comments)
                this.comments.appendChild(new CommentComponent(new Comment(comment)).element);
        })
    }
}