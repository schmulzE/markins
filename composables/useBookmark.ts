import { ref } from 'vue';
import { useSupabaseClient } from '#imports';
import type { Database } from '~/types/database.types';

export const useBookmark = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const isBookmarked = ref(false)

  const toggleBookmark = async (postId: string, commentId: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('profile_id', user.value?.id ?? '')
      .eq(postId ? 'post_id' : 'comment_id', postId || commentId)
      .maybeSingle()

    if (error) {
      throw new Error(`Error checking bookmark: ${error.message}`)
    }

    if (data) {
      // Remove bookmark
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', data.id)
      if (error) {
        throw new Error(`Error removing bookmark: ${error.message}`)
      } else {
        isBookmarked.value = false
      }
    } else {
      // Add bookmark
      const { error } = await supabase
        .from('bookmarks')
        .insert({ profile_id: user.value?.id, post_id: postId, comment_id: commentId })
      if (error) {
        throw new Error(`Error adding bookmark: ${error.message}`)
      } else {
        isBookmarked.value = true
      }
    }
  }

  const checkBookmarkStatus = async (postId: string, commentId: string) => {

    if (!user) return false;

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('profile_id', user.value?.id ?? '')
      .eq(postId ? 'post_id' : 'comment_id', postId || commentId)
      .maybeSingle()

    if (error) {
      throw new Error(`Error checking bookmark status: ${error.message}`)
    }

    isBookmarked.value = !!data
    return !!data
  }

  return {
    isBookmarked,
    toggleBookmark,
    checkBookmarkStatus,
  }
}