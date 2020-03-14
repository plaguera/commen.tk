class HTMLIndexElement {
    apiURL: HTMLInputElement;
    method: HTMLSelectElement;
    body: HTMLInputElement;
    submitBtn: HTMLInputElement;
    signinBtn: HTMLAnchorElement;
    result: HTMLInputElement;

    constructor() {
        this.apiURL = document.getElementById('apiURL') as HTMLInputElement;
        this.method = document.getElementById('method') as HTMLSelectElement;
        this.body = document.getElementById('body') as HTMLInputElement;
        this.submitBtn = document.getElementById('submitBtn') as HTMLInputElement;
        this.signinBtn = document.getElementById('signinBtn') as HTMLAnchorElement;
        this.result = document.getElementById('result') as HTMLInputElement;
        this.defaults();
        this.listeners();
    }

    defaults() {
        this.signinBtn.href = 'https://github.com/login/oauth/authorize?client_id=3de3fe66bebbf5945dab'
        //console.log(this.signinBtn.href);
        this.apiURL.value = 'http://localhost:3040/api/user'; // repos/plaguera/tfm-testing/issues/3/comments
        this.body.value = '{"body":"Comment #2"}';
        this.method.value = 'GET';
        if (this.method.value == 'GET') this.body.style.display = 'none';
        else if (this.method.value == 'POST') this.body.style.display = 'block';
    }

    listeners() {
        this.method.addEventListener("change", (e: Event) => {
            if (this.method.value == 'GET') this.body.style.display = 'none';
            else if (this.method.value == 'POST') this.body.style.display = 'block';
        });
        this.submitBtn.addEventListener("click", (e: Event) => this.submit());
    }

    async submit() {
        let parsedBody = JSON.parse(this.body.value);
        let init = {
            method: this.method.value,
            headers: {
                'Content-Type': 'application/json'
            }
        }
        if (init['method'] == 'POST')
            init['body'] = JSON.stringify(parsedBody);
            
        return await fetch(this.apiURL.value, init).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    this.result.value = JSON.stringify(json, undefined, 4);
                });
            }
        }).catch((e) => console.error(e));
    }
}

let index: HTMLIndexElement = new HTMLIndexElement();