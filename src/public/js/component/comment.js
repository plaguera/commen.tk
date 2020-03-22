import { Markdown } from "../types";

export class CommentComponent {
    constructor(comment) {
        this.element = document.createElement('div');
        this.element.className = 'timeline-item';
        Markdown.convert(comment.body).then(body => {
            this.element.innerHTML = `
            <div class="comment-component-avatar timeline-comment-avatar">
                <a href="${comment.user.html_url}">
                    <img class="avatar" src="${comment.user.avatar_url}" alt="${comment.user.login}">
                </a>
            </div>
            <div class="timeline-comment arrow_box">
                <div class="comment-header">
                    <a class="comment-header-anchor">
                        <strong class="">
                            <a class="author" href="${comment.user.login}">${comment.user.login}</a>
                        </strong>
                        commented
                        <a class="time-ago" title="${this.formatDate(comment.created_at)}" href="${comment.html_url}">
                            ${this.timeAgo(comment.created_at)}
                        <a/>
                    </a>
                </div>
                <div class="comment-body">
                <p>
                    ${body}
                </p>
                <div/>
            </div>`;
        });
        //console.log(this.timeAgo(comment.created_at));
    }

    formatDate(date) {
        return new Date(date).toGMTString();
    }

    timeElapsed(date) {
        let today = Date.now();
        let then = new Date(date);
        let seconds = Math.floor((today - then) / 1000);

        return {
            seconds: (((seconds % 31536000) % 86400) % 3600) % 60,
            minutes: Math.floor((((seconds % 31536000) % 86400) % 3600) / 60),
            hours: Math.floor(((seconds % 31536000) % 86400) / 3600),
            days: Math.floor((seconds % 31536000) / 86400),
            years: Math.floor(seconds / 31536000)
        };
    }

    timeAgo(date) {
        let time = this.timeElapsed(date);
        if (time.years > 0)
            return time.years + ' years ago';
        else if (time.days > 0)
            return time.days + ' days ago';
        else if (time.hours > 0)
            return time.hours + ' hours ago';
        else if (time.minutes > 1)
            return time.minutes + ' minutes ago';
        else if (time.minutes > 0)
            return time.minutes + ' minute ago';
        else if (time.seconds > 10)
            return time.seconds + ' seconds ago';
        else
            return 'just now';
    }
}