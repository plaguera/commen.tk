import '../scss/header.scss';
import { Github } from './github';
import { CommentWidget } from './comment-widget';

export class Header {
    constructor() {
        this.element = document.createElement('header');
        this.element.innerHTML = `
            <div class="header-element">
                <input type="text" class="header-input" id="user-input" value="ULL-MII-SYTWS-1920">
            </div>
            <div class="header-element">
                <select class="header-select" id="repo-input"></select>
            </div>
            <div class="header-element">
                <select class="header-select" id="issue-input"></select>
            </div>
        `;
        let inputUser = this.element.getElementsByClassName('header-input')[0];
        let inputRepo = this.element.getElementsByClassName('header-select').namedItem('repo-input');
        let inputIssue = this.element.getElementsByClassName('header-select').namedItem('issue-input');
        inputUser.addEventListener('keyup', (event) => {
            if (event.keyCode == 13) {
                event.preventDefault();
                inputRepo.innerHTML = '';
                inputIssue.innerHTML = '';
                Github.repos(inputUser.value).then(result => {
                    for (let repo of result) {
                        let option = document.createElement('option');
                        option.textContent = repo.full_name;
                        option.value = repo.name;
                        inputRepo.appendChild(option);
                    }
                });
            }
        });

        inputRepo.addEventListener('change', (event) => {
            event.preventDefault();
            inputIssue.innerHTML = '';
            Github.issues(inputUser.value, inputRepo.value).then(result => {
                for (let issue of result) {
                    let option = document.createElement('option');
                    option.textContent = issue.title;
                    option.value = issue.number;
                    inputIssue.appendChild(option);
                }
            });
        });

        inputIssue.addEventListener('change', (event) => {
            event.preventDefault();
            CommentWidget.setAttributes(inputUser.value, inputRepo.value, inputIssue.value);
        });
    }
}