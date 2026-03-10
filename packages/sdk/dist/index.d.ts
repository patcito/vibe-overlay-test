import { SupabaseClient } from '@supabase/supabase-js';

interface ToolbarConfig {
    position: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
    user?: {
        id: string;
        email: string;
        avatarUrl?: string;
    };
    projectId: string;
}
interface ToolbarData {
    commentCount: number;
    activeComments: number;
    previewComments: number;
    deployedComments: number;
}
declare class ToolbarModule {
    private supabase;
    private config;
    private toolbar?;
    private data;
    private isVisible;
    private isExpanded;
    constructor(supabase: SupabaseClient, config: ToolbarConfig);
    init(): Promise<void>;
    destroy(): void;
    private createToolbar;
    private addToolbarStyles;
    private getPositionStyles;
    private getTransformDirection;
    private renderToolbar;
    private attachButtonListeners;
    private attachEventListeners;
    private removeEventListeners;
    private handleOutsideClick;
    private handleCommentsUpdated;
    private loadData;
    private expand;
    private collapse;
    private openCommentsList;
    private openSettings;
    private openUserSettings;
    private show;
    private hide;
    private formatCount;
    private getInitials;
    updateConfig(config: Partial<ToolbarConfig>): void;
    refresh(): Promise<void>;
    toggle(): void;
    isToolbarVisible(): boolean;
    getData(): ToolbarData;
}

type CommentStatus = 'active' | 'preview' | 'deployed';
type CommentFilter = 'all' | CommentStatus;
interface CommentListItem {
    id: string;
    content: string;
    status: CommentStatus;
    page_path: string | null;
    element_selector?: string;
    branch_name?: string;
    pr_url?: string;
    preview_url?: string;
    created_at: string;
    created_by: string;
    metadata?: any;
    author_name?: string;
    author_email?: string;
    approval_count?: number;
    required_approvals?: number;
}
interface CommentListConfig {
    projectId: string;
    currentUser?: {
        id: string;
        email: string;
        role?: string;
    };
}
declare class CommentListModule {
    private supabase;
    private config;
    private modal?;
    private comments;
    private filteredComments;
    private currentFilter;
    private isVisible;
    constructor(supabase: SupabaseClient, config: CommentListConfig);
    show(): Promise<void>;
    hide(): void;
    private loadComments;
    private createModal;
    private addStyles;
    private createHeader;
    private createFilters;
    private updateFilterButtons;
    private renderComments;
    private renderComment;
    private renderStatusBadge;
    private renderCommentActions;
    private renderApprovalDots;
    private attachEventListeners;
    private removeEventListeners;
    private handleCommentUpdated;
    private handleCommentAction;
    private viewComment;
    private approveComment;
    private requestChanges;
    private rollbackComment;
    private replyToComment;
    private applyFilter;
    private setFilter;
    private formatRelativeTime;
    private truncateText;
    refresh(): Promise<void>;
    isModalVisible(): boolean;
    getComments(): CommentListItem[];
    getFilteredComments(): CommentListItem[];
    getCurrentFilter(): CommentFilter;
}

interface UserIdentity {
    id: string;
    email: string;
}
declare class AuthModule {
    private supabase;
    private providedUser?;
    private modal?;
    constructor(supabase: SupabaseClient, user?: UserIdentity);
    checkAuth(): Promise<boolean>;
    showLoginModal(): Promise<void>;
    private createLoginModal;
    getCurrentUser(): Promise<UserIdentity | null>;
}

interface PreviewElement {
    element: HTMLElement;
    commentId: string;
    wrapper: HTMLElement;
    badge?: HTMLElement;
    tooltip?: HTMLElement;
}
declare class PreviewModule {
    private previews;
    private observer?;
    private isActive;
    init(): void;
    destroy(): void;
    private detectExistingPreviews;
    private setupMutationObserver;
    private isPreviewElement;
    private processPreviewElement;
    private addPreviewHighlight;
    private createCommentBadge;
    private createHoverTooltip;
    private setupHoverEvents;
    private openCommentThread;
    private removePreview;
    private cleanupPreview;
    getPreviews(): PreviewElement[];
    static shouldActivatePreviewMode(): boolean;
    static getCommentIdFromUrl(): string | null;
}

interface Comment {
    id: string;
    content: string;
    element_selector?: string;
    element_xpath?: string;
    element_parent_chain?: string[];
    x: number;
    y: number;
    created_at: string;
    created_by: string;
}
declare class OverlayModule {
    private supabase;
    private projectId;
    private overlay?;
    private highlight?;
    private previewBanner?;
    private previewModule;
    private comments;
    private isActive;
    private modalOpen;
    private isPreviewMode;
    private previewCommentId;
    constructor(supabase: SupabaseClient, projectId: string);
    init(): Promise<void>;
    destroy(): void;
    private createOverlay;
    private attachEventListeners;
    private removeEventListeners;
    private isVibeElement;
    private handleElementClick;
    private handleElementHover;
    private handleElementHoverOut;
    private hideHighlight;
    private showCommentModal;
    private createComment;
    private getElementSelector;
    private getElementXPath;
    private getElementParentChain;
    private loadComments;
    private renderCommentPins;
    private showCommentDetails;
    private createPreviewBanner;
    private handlePreviewApproval;
    private showPreviewActionFeedback;
    private openCommentThread;
    private hidePreviewBanner;
    isInPreviewMode(): boolean;
    getPreviewCommentId(): string | null;
    getPreviews(): PreviewElement[];
}

interface CommentMetadata {
    browser: {
        name: string;
        version: string;
        userAgent: string;
    };
    os: {
        name: string;
        version: string;
    };
    viewport: {
        width: number;
        height: number;
        devicePixelRatio: number;
    };
    page: {
        url: string;
        path: string;
        title: string;
    };
    user: {
        timezone: string;
        language: string;
        colorScheme: 'light' | 'dark';
    };
    timestamp: string;
}
declare function captureMetadata(): CommentMetadata;

declare function captureElementScreenshot(element: HTMLElement): Promise<string>;
declare function uploadScreenshot(blob: Blob, supabaseClient: any, bucket?: string): Promise<string>;
declare function blobToDataURL(blob: Blob): Promise<string>;

interface VibeConfig {
    supabaseUrl: string;
    supabaseAnonKey: string;
    projectId: string;
    user?: {
        id: string;
        email: string;
    };
}
declare class VibeInstance {
    private supabase;
    private auth;
    private overlay;
    private toolbar?;
    private commentList?;
    private config;
    private isActive;
    constructor(config: VibeConfig);
    activate(): Promise<void>;
    destroy(): void;
    private setupEventHandlers;
    getSupabaseClient(): SupabaseClient;
    getToolbar(): ToolbarModule | undefined;
    getCommentList(): CommentListModule | undefined;
}
declare function initVibe(config: VibeConfig): VibeInstance;

export { AuthModule, type Comment, type CommentFilter, type CommentListConfig, type CommentListItem, CommentListModule, type CommentMetadata, type CommentStatus, OverlayModule, type PreviewElement, PreviewModule, type ToolbarConfig, type ToolbarData, ToolbarModule, type UserIdentity, type VibeConfig, VibeInstance, blobToDataURL, captureElementScreenshot, captureMetadata, initVibe, uploadScreenshot };
