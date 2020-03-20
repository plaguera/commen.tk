export class Util {
    static deparamUrl() {
        let params = decodeURI(location.href).split('?')[1];
        if (!params) return;
        window.history.replaceState(null, null, window.location.pathname);
        params = params.replace(/&/g, '","').replace(/=/g, '":"');
        return JSON.parse('{"' + params + '"}');
    }

    static loadCSS(url) {
        var link_tag = document.createElement('link');
        link_tag.setAttribute("type", "text/css");
        link_tag.setAttribute("rel", "stylesheet");
        link_tag.setAttribute("href", url);
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(link_tag);
    }
}