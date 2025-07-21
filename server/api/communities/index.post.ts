import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const client = await serverSupabaseClient(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const {
    name,
    slug,
    description,
    category,
    type,
    icon,
    allow_images,
    allow_links,
    require_approval,
    rules
  } = await readBody(event)

  const { data: community, error } = await client
    .from('communities')
    .insert([{
      name,
      slug,
      description,
      category,
      type,
      icon,
      require_approval,
      allow_images,
      allow_links,
    }])
    .select()
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating community'
    })
  }

  // Fetch the moderator role id from moderator_roles table
  const { data: moderatorRole, error: roleError } = await client
    .from('moderator_roles')
    .select('id')
    .eq('name', 'Full Moderator')
    .single()

  if (roleError || !moderatorRole) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching moderator role'
    })
  }

  const { error: membersError } = await client
    .from('community_members')
    .insert([{
      user_id: user.id,
      community_id: community.id,
      is_moderator: true,
      is_approved: true,
      role_id: moderatorRole.id
    }])

    if (membersError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error creating community member'
      })
    }  

  if (rules && rules.length > 0) {
    const rulesToInsert = rules.map((rule: string) => ({
      community_id: community.id,
      rule
    }))

    const { error: rulesError } = await client
      .from('community_rules')
      .insert(rulesToInsert)

    if (rulesError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error creating community rules'
      })
    }
  }

  return { data: community }
})
