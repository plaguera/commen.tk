export interface UserProps {
    url: string;
    login: string;
    avatarUrl: string;
}

export interface CommentProps {
    url: string;
    key: string;
    bodyHTML: string;
    createdAt: string;
    author: UserProps;
    authorAssociation: string;
    viewerDidAuthor: boolean;
}

export interface CommentHeaderLabelProps {
    authorAssociation: string;
}

export interface PaginationButtonProps {
    hiddenItems: number;
    user: UserProps;
    onClick: () => void;
}

export interface WidgetProps {
    owner: string;
    repo: string;
    issuename: string;
    issuenumber: number;
    theme: string;
    pageSize: number;
}

export interface WidgetState {
    comments: CommentProps[];
    issue: number;
    user?: UserProps;
    totalCount: number;
    hiddenItems: number;
    cursor: string;
}

export interface EditorProps {
    user: UserProps;
    onComment: (text: string) => void;
}

export interface EditorState {
    text: string;
}