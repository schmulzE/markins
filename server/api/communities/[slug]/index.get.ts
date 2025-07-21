import type { Database } from "~/types/database.types";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    const slug = event.context.params?.slug 

    const client = await serverSupabaseClient<Database>(event);
    // Fetch the community
    const { data: community, error: communityError } = await client
      .from("communities")
      .select(`*, community_members(*)`)
      .eq('slug', slug!)
      .single();

    if (communityError) throw createError({ statusMessage: communityError.message });
    
    // Then fetch moderators
    const { data: moderators, error } = await client
      .from('community_members')
      .select(`
        user_id,
        profiles!community_members_user_id_fkey(
          id,
          username,
          avatar_url
        )
      `)
      .eq('is_moderator', true)
      .eq('community_id', community.id)
      .order('joined_at', { ascending: true })
          
    if (error) throw createError({ statusMessage: error.message });

    const communityData = {
      ...community,
      moderators: moderators.map(mod => mod.profiles)
    }

    return { data : communityData };

  } catch (error) {
    if (error instanceof Error)
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }))
  }
});