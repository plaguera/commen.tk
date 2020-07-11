import superagent, { Response } from 'superagent';
import env from './environment';

const responseBody = (res: Response) => res.body;
const requests = {
    del: (url: string) =>
        superagent.del(`${env.url_api}${url}`).withCredentials().then(responseBody).catch(console.error),
    get: (url: string) =>
        superagent.get(`${env.url_api}${url}`).withCredentials().then(responseBody).catch(console.error),
    put: (url: string, body: any) =>
        superagent.put(`${env.url_api}${url}`, body).withCredentials().then(responseBody).catch(console.error),
    post: (url: string, body: any) =>
        superagent.post(`${env.url_api}${url}`, body).withCredentials().then(responseBody).catch(console.error)
};

const Comments = {
    create: (comment: string) =>
        requests.post(`issues/${env.attributes.repo}/${env.attributes.issue.number}/comments`, { body: comment }),
    modify: (comment: string) =>
        requests.put(`issues/${env.attributes.repo}/${env.attributes.issue.number}/comments`, { body: comment }),
    delete: (id: string) =>
        requests.del(`comments/${id}`)
};

const page = (cursor?: string) => cursor ? `&cursor=${cursor}` : '';

const Issues = {
    comments: (cursor?: string) =>
        requests.get(`issues/${env.attributes.repo}/${env.attributes.issue.number}/comments?pagesize=${env.attributes.pageSize}${page(cursor)}`),
    number: (name: string) =>
        requests.get(`issues/${env.attributes.repo}/${name}`)
}

const Users = {
    viewer: () =>
        requests.get('user')
}

const Actions = {
    signout: () =>
        requests.get('logout')
}

export default {
    Actions,
    Comments,
    Issues,
    Users
};