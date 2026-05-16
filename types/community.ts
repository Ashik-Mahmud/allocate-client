import { Role } from ".";

export enum CommunityHubPostType {
    ANNOUNCEMENT = 'ANNOUNCEMENT',
    RESOURCE_SPOTLIGHT = 'RESOURCE_SPOTLIGHT',
    USER_STORY = 'USER_STORY',
    EVENT = 'EVENT',
    ISSUES = 'ISSUES',
    RESOLVED = 'RESOLVED',
    GENERAL_DISCUSSION = 'GENERAL_DISCUSSION',
    OTHER = 'OTHER',
    SYSTEM_QUERY = 'SYSTEM_QUERY',
}

export enum CommunityHubStatus {
    PUBLISHED = 'PUBLISHED',
    DRAFT = 'DRAFT',
    ARCHIVED = 'ARCHIVED',
}

export type CommunityPostFilter = {
    postType?: CommunityHubPostType | null,
    status?: CommunityHubStatus | null,
    authorId?: string | null,
    isPrivate?: boolean | null,
    search?: string | null,
    page?: number,
    limit?: number,
};
export interface PostCommunityFormData {
    title: string;
    content: string;
    imageUrl: string;
    visibility: PostVisibility;
    isPrivate: boolean;
    postType: CommunityHubPostType;
    status: CommunityHubStatus;
}

export interface PostVisibility {
    showToAdmin: boolean;
    showToStaff: boolean;
    showToOrgAdmin: boolean;
}

export interface CommentStructure {
    id: string, // Better than Date.now()
    content: string,
    authorName: string,
    authorId: string,
    email: string,
    createdAt: string
}

export interface AcknowledgmentStructure {
    userId: string;
    userName: string;
    acknowledgedAt: string;
}

// 3. Main CommunityHub Model Type
export interface CommunityHub {
    id: string;
    org_id: string | null;
    title: string;
    content: string;
    imageUrl: string | null;
    authorId: string | null;
    authorName: string | null;
    authorRole: Role | null;

    // JSON fields typed explicitly
    comments: CommentStructure[] | null;
    acknowledgments: AcknowledgmentStructure[] | null;
    visibility: PostVisibility;

    status: CommunityHubStatus;
    postType: CommunityHubPostType;
    isPrivate: boolean;

    // Date handles (Prisma dates return as Date objects locally, or strings if serialized over JSON)
    deletedAt: Date | string | null;
    createdAt: Date | string;
    updatedAt: Date | string;

    // Optional relational fields if populated via Prisma's `include`
    organization?: any; // Replace 'any' with your Organization type if needed
    author?: any;       // Replace 'any' with your User type if needed
}