import { useSupabaseClient, useSupabaseUser } from '#imports';
import type { Database } from '~/types/database.types';

export const useBookmark = () => {
  const supabase = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const toggleBookmark = async ({
    postId,
    commentId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    currentState,
    onRevert,
  }: {
    postId?: string;
    commentId?: string;
    currentState: boolean;
    onRevert: () => void;
  }) => {
    if (!user.value) return;

    const key = postId ? 'post_id' : 'comment_id';
    const value = postId ?? commentId;

    if (!value) {
      onRevert();
      throw new Error('No postId or commentId provided for bookmark operation.');
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('profile_id', user.value.id)
      .eq(key, value as string)
      .maybeSingle();

    if (error) {
      onRevert();
      throw new Error(`Error checking bookmark: ${error.message}`);
    }

    if (data) {
      const { error: deleteError } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', data.id);

      if (deleteError) {
        onRevert();
        throw new Error(`Error removing bookmark: ${deleteError.message}`);
      }
    } else {
      const { error: insertError } = await supabase
        .from('bookmarks')
        .insert({
          profile_id: user.value.id,
          post_id: postId ?? null,
          comment_id: commentId ?? null,
        });

      if (insertError) {
        onRevert();
        throw new Error(`Error adding bookmark: ${insertError.message}`);
      }
    }
  };

  const checkBookmarkStatus = async (postId?: string, commentId?: string) => {
    if (!user.value) return false;

    const key = postId ? 'post_id' : 'comment_id';
    const value = postId ?? commentId;

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('profile_id', user.value.id)
      .eq(key, value as string)
      .maybeSingle();

    if (error) {
      throw new Error(`Error checking bookmark status: ${error.message}`);
    }

    return !!data;
  };

  return {
    toggleBookmark,
    checkBookmarkStatus,
  };
};