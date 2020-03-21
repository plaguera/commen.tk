import { Github } from "../github";
import { Comment, Issue } from "../types"
import { CommentComponent } from "./comment"

export class TimelineComponent {
    constructor(data) {
        TimelineComponent.instance = this;
        this.element = document.createElement('div');
        this.element.className = 'timeline-component';
        this.comments = document.createElement('div');
        this.comments.className = 'comment-list';
        this.element.appendChild(this.comments);
        console.log(data);
        if (data['user'] && data['repo'] && data['issue'])
            this.loadIssue(data);
        //this.loadIssue('plaguera', 'tfm-testing', 1);
    }

    loadIssue(data) {
        Github.issue(data['user'], data['repo'], data['issue']).then(issue => {
            this.comments.innerHTML = '';
            let issueObj = new Issue(data['repo'], issue);
            issueObj.comments().then(result => {
                for (let comment of result) {

                    this.comments.appendChild(new CommentComponent(new Comment(comment)).element);
                }
            });
        })
    }
}