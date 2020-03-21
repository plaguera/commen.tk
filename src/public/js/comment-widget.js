import { TimelineComponent } from "./component/timeline"
import { EditorComponent } from "./component/editor";

export class CommentWidget {

    static init() {
        CommentWidget.attributes = CommentWidget.parse();
        let root = document.body.getElementsByClassName('comment-widget')[0];
        let separator = document.createElement('hr');
        separator.className = 'solid';

        CommentWidget.timeline = new TimelineComponent(CommentWidget.attributes);
        CommentWidget.editor = new EditorComponent();

        root.appendChild(CommentWidget.timeline.element);
        root.appendChild(separator);
        root.appendChild(CommentWidget.editor.element);
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
        //let script = document.querySelector('script[src^="http://localhost:3040/public/client.js"]');
    }

    static reloadTimeline() {
        CommentWidget.timeline.loadIssue(CommentWidget.attributes);
    }

    static setAttributes(user, repo, issue) {
        CommentWidget.attributes['user'] = user;
        CommentWidget.attributes['repo'] = repo;
        CommentWidget.attributes['issue'] = issue;
        CommentWidget.timeline.loadIssue(CommentWidget.attributes);
    }
}