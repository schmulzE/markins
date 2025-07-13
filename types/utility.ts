import type { Tables } from "./database.types";

type NestedResponse<T> = {
  [K in keyof T]?: T[K];
};

export type Post = NestedResponse<
  Tables<'posts'> & { 
    author: Tables<'profiles'>, 
    community: Tables<'communities'> & { community_members: Tables<'community_members'>[] }, // <-- fixed this
    votes: Tables<'post_votes'>[],
    comments: Tables<'comments'>[],
    bookmarks: Tables<'bookmarks'>
    is_bookmarked?: boolean, // <-- add this
    user_vote?: 'up' | 'down' | null // <-- add this,
    post_flairs: Tables<'post_flairs'> & { flairs: Tables<'flairs'>[] },
  }
>;

export type Profile = Tables<'profiles'> & {
  posts: (Tables<'posts'> & {
    community: Pick<Tables<'communities'>, 'name' | 'icon'>;
  })[];
  comments: (Tables<'comments'> & {
    post: Pick<Tables<'posts'>, 'title'> & {
      community: Pick<Tables<'communities'>, 'name'>;
    };
  })[];
  bookmarks: (Tables<'bookmarks'> & {
    post: Tables<'posts'> & {
      community: Pick<Tables<'communities'>, 'name' | 'icon'>;
    };
  })[];
};


export type Comment = {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar_url?: string;
    display_name?: string;
  };
  created_at: string;
  upvotes: number;
  downvotes: number;
  user_vote: 'up' | 'down' | null;
  replies: Comment[];
  is_collapsed?: boolean;
  depth: number;
  is_op: boolean;
  is_moderator: boolean;
  parent_comment_id?: string;
  post_id?: string;
  comment_votes?: Array<{ user_id: string; vote_type: 'up' | 'down' }>;
  reported_by?: string[];
  report_count: number;
  is_bookmarked: boolean;
  is_deleted: boolean;
  deleted_at?: string;
  deleted_by?: string;
};

export type Community = 
  Tables<'communities'> & { 
    community_members: Tables<'community_members'>[],
    moderators: Tables<'profiles'>[],
    is_joined: boolean,
    posts_today: number,
    growth_rate: string,
  }

export type Flair = NestedResponse<
  Tables<'flairs'>
>;

export type DirectMessages = NestedResponse<
  Tables<'direct_messages'>
>;