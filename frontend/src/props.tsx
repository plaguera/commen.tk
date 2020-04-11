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
    authorAssociation: string;
    viewerDidAuthor: boolean;
}

export interface CommentHeaderLabelProps {
    authorAssociation: string;
}

export interface WidgetProps {
    user: string;
    repo: string;
    number: number;
    theme: string;
    pageSize: number;
}

export interface WidgetState {
    comments: CommentProps[];
    user: UserProps;
    totalCount: number;
}

export interface EditorProps {
    user: UserProps;
    onComment: (text: string) => void;
}

export interface EditorState {
    text: string;
}