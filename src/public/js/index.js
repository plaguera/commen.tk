import '../scss/client.scss';
import { Auth } from "./auth";
import { CommentWidget } from "./comment-widget";
import { Header } from "./header";

Auth.init();
document.body.before(new Header().element);
CommentWidget.init();