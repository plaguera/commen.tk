import '../scss/client.scss';
import { Auth } from './auth';
import { CommentWidget } from "./comment-widget"

Auth.init();
CommentWidget.init(document.body.getElementsByClassName('comment-widget')[0]);