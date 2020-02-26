import { CommentComponent } from './comment-component';
import {
    Issue,
    IssueComment,
    loadIssue,
    loadIssues
} from './github';

const port = process.env.PORT || '3000';
// /user/repos
// /repos/ULL-ESIT-GRADOII-TFG/utterances/issues
// /repos/ULL-ESIT-GRADOII-TFG/utterances/issues/1
// /repos/ULL-ESIT-GRADOII-TFG/utterances/issues/1/comments
document.body.textContent = 'HOLAAA';
console.log(document.title);
//const popover = document.createElement("div");

loadIssues().then(function (result) {
    //for (let issue of result) {
        console.log(result);
        //document.body.appendChild(new CommentComponent(issue).element);
    //}
});