import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/database.types";

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')
  try {
    
    const client = await serverSupabaseClient<Database>(event);
    
    const { data, error } = await client.from("communities").select(`*, community_members(*)`).eq('name', name!).single()
    if(error) throw createError({ statusMessage: error.message }) 
    return { data }
  
  } catch (error) {
    if(error instanceof Error)
      sendError(event, createError({
        ...error,
        statusMessage: error.message,
      }))
  }
});