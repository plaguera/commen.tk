export class Auth {
    public static token : string = '';
    static validate() {
        Auth.token = process.env.GITHUB_ACCESS_TOKEN || '';
    }
}