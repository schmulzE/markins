import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const query = getQuery(event);

  const searchTerm = query.q as string;
  const page = parseInt(query.page as string) || 1;
  const itemsPerPage = parseInt(query.itemsPerPage as string) || 10;

  if (!searchTerm) {
    return { data: [], error: 'Search term is required' };
  }

  const { data, error } = await client
    .from('posts')
    .select('*, comments(*), profiles!posts_profile_id_fkey(*)')
    .textSearch('title', searchTerm, { type: 'websearch' })
    .range((page - 1) * itemsPerPage, page * itemsPerPage - 1)
    .order('created_at', { ascending: true });

  if (error) {
    return { data: [], error: error.message };
  }

  return data;
});