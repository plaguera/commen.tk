let endpoint = document.getElementById('endpoint') as HTMLInputElement;
endpoint.value = 'http://localhost:3040/api/';
let route = document.getElementById('route') as HTMLInputElement;
route.value = 'users';
let btn = document.getElementById("submitbtn") as HTMLInputElement;
btn.addEventListener("click", (e: Event) => submit());

export default async function submit() {
    console.log('PRESSED !!');
    let endpoint = document.getElementById('endpoint') as HTMLInputElement;
    let route = document.getElementById('route') as HTMLInputElement;

    let url = endpoint.value + route.value;
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        }
    }).then(response => {
        if (response.ok) {
            response.json().then(json => {
                let result = document.getElementById('result') as HTMLInputElement;
                result.value = JSON.stringify(json, undefined, 4);
            });
        }
    }).catch((e) => console.error(e));
}