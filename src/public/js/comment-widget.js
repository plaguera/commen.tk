import { TimelineComponent } from "./component/timeline"
import { EditorComponent } from "./component/editor";
import { Issue } from "./types";

export class CommentWidget {

    static init() {
        let attrs = CommentWidget.parse();
        Issue.find(attrs.user, attrs.repo, attrs.issue).then(issue => {
            CommentWidget.issue = issue;

            let root = document.body.getElementsByClassName('comment-widget')[0];
            let separator = document.createElement('hr');
            separator.className = 'solid';

            CommentWidget.timeline = new TimelineComponent();
            CommentWidget.editor = new EditorComponent();

            root.appendChild(CommentWidget.timeline.element);
            root.appendChild(separator);
            root.appendChild(CommentWidget.editor.element);
        });

    }

    static parse() {
        let script = document.currentScript;
        let attributes = script.attributes;
        let result = {
            user: attributes['repo']['value'].split('/')[0],
            repo: attributes['repo']['value'].split('/')[1],
            issue: attributes['repo']['value'].split('/')[2]
        }
        script.removeAttribute('repo');
        return result;
    }

    static reload() {
        CommentWidget.timeline.reload();
    }

    static setIssue(issue) {
        CommentWidget.issue = issue;
        CommentWidget.timeline.reload();
    }
}