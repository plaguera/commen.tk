import { TimelineComponent } from "./component/timeline"
import { EditorComponent } from "./component/editor";

export class CommentWidget {
    constructor(htmlElement) {
        this.element = htmlElement;
        let separator = document.createElement('hr');
        separator.className = 'solid';

        this.element.appendChild(new TimelineComponent().element);
        this.element.appendChild(separator);
        this.element.appendChild(new EditorComponent().element);
    }

    static init(data) {
        let root = document.body.getElementsByClassName('comment-widget')[0];
        let separator = document.createElement('hr');
        separator.className = 'solid';

        root.appendChild(new TimelineComponent(data).element);
        root.appendChild(separator);
        root.appendChild(new EditorComponent().element);
    }
}