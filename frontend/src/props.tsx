export interface UserProps {
    url: string;
    login: string;
    avatarUrl: string;
}

export interface CommentProps {
    author: UserProps;
    authorAssociation: string;
    bodyHTML: string;
    createdAt: string;
    id: string;
    key: string;
    url: string;
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

export interface Attributes {
    repo: string;
    issue: {
        name: string,
        number: number,
    };
    theme: string;
    pageSize: number;

}

export interface WidgetProps {
    issue: {
        name: string,
        number: number
    };
}

export interface WidgetState {
    comments: CommentProps[];
    issue: {
        number: number;
        url: string;
    };
    totalCount: number;
    hiddenItems: number;
    cursor?: string;
    viewer?: UserProps;
}

export interface OptionButtonProps {
    onLogout: () => void;
}

export interface EditorProps {
    viewer: UserProps;
    onComment: (text: string) => void;
    onSignout: () => void;
}

export interface EditorState {
    text: string;
}