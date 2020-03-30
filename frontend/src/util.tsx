export function getCookie(name: string) {
    var re = new RegExp('[; ]' + name + '=([^\\s;]*)');
    var sMatch = (' ' + document.cookie).match(re);
    if (name && sMatch) return JSON.parse(unescape(sMatch[1]));
    return;
}