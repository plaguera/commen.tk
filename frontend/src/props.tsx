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
    pagination: {
        totalCount: number;
        hiddenItems: number;
        cursor: string;
    }
    viewer?: UserProps;
}

export interface OptionButtonProps{
    onLogout: () => void;
}

export interface EditorProps {
    user: UserProps;
    onComment: (text: string) => void;
    onLogout: () => void;
}

export interface EditorState {
    text: string;
}