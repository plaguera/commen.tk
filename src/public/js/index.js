import '../scss/client.scss';
import { Auth } from "./auth";
import { CommentWidget } from "./comment-widget";
import { Header } from "./header";
import { Attributes } from './attributes';

Auth.init();
document.body.before(new Header().element);
CommentWidget.init(Attributes.parse());