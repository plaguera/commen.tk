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
    issueAuthorDidAuthor: boolean;
    key: string;
    onDelete: (id: string) => void;
    url: string;
    viewerDidAuthor: boolean;
    labels: CommentLabelsProps;
}

export interface CommentLabelProps {
    tooltip: string;
}

export interface CommentLabelsProps {
    issueAuthorDidAuthor: boolean;
    authorAssociation: string;
    viewerDidAuthor: boolean;
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
        author: string;
        number: number;
        url: string;
    };
    totalCount: number;
    hiddenItems: number;
    cursor?: string;
    viewer?: UserProps;
}

export interface EditorProps {
    viewer: UserProps;
    onComment: (text: string) => void;
    onSignout: () => void;
}

export interface EditorState {
    text: string;
}

export interface TimelineProps {
    comments: CommentProps[];
    issueAuthor: string;
    onCommentDelete: (id: string) => void;
}