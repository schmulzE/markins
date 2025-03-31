<script lang="ts" setup>
import type { Database, Tables } from '~/types/database.types';
import { getRecentPostsFromCommunities } from '~/composables/useRecentPosts';

interface RecentPosts {
  id: string;
  title: string;
  content: string;
  created_at: string;
  community_id: string;
  profile_id: string;
  communities: Tables<'communities'>;
  profiles: Tables<'profiles'>;
  comments: Tables<'comments'>[];
  votes: Tables<'votes'>[];
}

const loading = ref(false)
const communityIds = ref<string[]>([])
const posts = ref<RecentPosts[]>([])
const supabase = useSupabaseClient<Database>()

const fetchCommunityIds = async () => {
  if (loading.value) return

  loading.value = true
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error('An error occured while fetching posts:')
  } else if (data) {
    communityIds.value = data.map((item) => item.id)
    const { recentPosts } = await getRecentPostsFromCommunities(communityIds.value, 5)
    posts.value = recentPosts as RecentPosts[]
  }

  loading.value = false
}

onMounted(() => {
  fetchCommunityIds()
})
</script>

<template>
  <aside class="hidden md:block md:transition md:delay-100 md:duration-300 ease-in-out md:sticky md:top-0 w-full max-w-xs px-2 hover:overflow-auto hover:h-full hover:pb-4">
    <div class="mt-8 p-3 rounded-lg bg-base-100">
      <div class="flex justify-between items-center">
        <h1 class="uppercase text-sm">recent posts</h1>
      </div>
      <div class="text-center">
        <span v-if="loading" class="text-gray-600 text-2xl loading loading-spinner" />
      </div>
      <ul>
        <li v-for="post in posts" :key="post.id" class="py-4 border-b border-base-300 last-of-type:border-none">
          <div class="flex gap-x-2">
            <div class="avatar">
              <div class="w-5 rounded-full bg-white">
                <img :src="`/images/${post.communities.name === 'GeneralScience' ? 'general-science.jpg' : post.communities.name + '.png'}`">
              </div>
            </div>
            <nuxt-link :to="`/m/${post.communities.name}`" class="text-xs">m/{{ post.communities.name }}</nuxt-link>
          </div>
          <nuxt-link 
          :to="`/post/${post.id}/${formatTitle(post.title.toLowerCase())}`" 
          class="text-sm hover:underline py-1.5 font-medium block first-letter:uppercase lowercase"
          >
            {{ post.title }}
          </nuxt-link >
          <div class="flex text-xs">{{ post.votes?.length }} upvotes . {{ post.comments?.length }} comments</div>
        </li>
      </ul>
    </div>
  </aside>
</template>