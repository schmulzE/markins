import type { Tables } from "./database.types";
export type NestedResponse<T, K extends keyof T> = T & {
  [P in K]: T[P] extends Array<infer U> ? NestedResponse<U, keyof U>[] : NestedResponse<T[P], keyof T[P]>;
};

export type BookmarkResponse = {
  id: string;
  post_id: number | null;
  comment_id: number | null;
  post: (Tables<'posts'> & {
    bookmarks: Tables<'bookmarks'>[];
    comments: Tables<'comments'>[];
    profiles: Tables<'profiles'>;
    post_tags: Tables<'post_tags'>[]; 
    tags: Tables<'tags'>[];
  }) | null;
  comment: NestedResponse<Tables<'comments'> & { profiles: Tables<'profiles'> }, 'id'> | null;
};


export type Posts = NestedResponse<
  Tables<'posts'> & { profiles: Tables<'profiles'>, comments: Tables<'comments'>[], post_tags: Tables<'post_tags'>[], tags: Tables<'tags'>[]; },
  'id'
>;

export type Profile = NestedResponse<
Tables<'profiles'> & { posts: Tables<'posts'>[], comments: Tables<'comments'>[], post_tags: Tables<'post_tags'>[], tags: Tables<'tags'>[] },
'id'
>;

export type Comments = NestedResponse<
  Tables<'comments'> & { profiles: Tables<'profiles'> },
  'id'
>;