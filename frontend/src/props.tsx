export interface UserProps {
    url: string;
    login: string;
    avatarUrl: string;
}

export interface CommentProps {
    url: string;
    key: string;
    body: string;
    createdAt: string;
    author: UserProps;
}

export interface IssueProps {
    user: string;
    repo: string;
    number: number;
}

export interface EditorProps {
    user: UserProps;
    onComment: (text: string) => void;
}