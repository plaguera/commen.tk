export class Attributes {
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
}