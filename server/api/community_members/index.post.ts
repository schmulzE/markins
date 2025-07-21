import type { Database } from "~/types/database.types";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const client = await serverSupabaseClient<Database>(event);
  //role id comes from the moderator_role table, use id of role with name "Full Moderator"
  const { userId, communityId, roleId } = body;

  if (!body)
    throw createError({ statusCode: 400, statusMessage: "Bad Request" });


   const { error } = await client
      .from('community_members')
      .insert([{
        user_id: userId, 
        community_id: communityId, 
        is_moderator: true, 
        is_approved: true,
        role_id: roleId
        // role_id: '49fd3034-0498-4545-a1cc-da277fa34d9f'
      }])

  
  if(error) {
    throw createError({ statusMessage: error.message })
  }

  return { message: "Member added successfully" };
});