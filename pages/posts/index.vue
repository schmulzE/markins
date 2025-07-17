<template>
  <ForumLayout>
    <template #header>
      <ForumNavbar>
        <template #dynamic-content>
          <NuxtLink to="/post/create" class="btn btn-sm md:btn-md p-2 bg-[#297D4E] text-white hover:bg-[#1f5a37]">
            <i class="h-4 w-4 md:mr-2 i-lucide-plus" />
            <span class="hidden md:inline">Create Post</span>
          </NuxtLink>
        </template>
      </ForumNavbar>
    </template>
    <template #left-sidebar>
      <JoinedCommunities  :joined-communities="joinedCommunities"/>
      <ForumCommunityDiscoverCommunities 
      :unjoined-communities="unjoinedCommunities"
      @join-community="handleJoinCommunity" 
      />
    </template>

    <template #main>
      <PostFeed
        table-name="posts"
        :columns="[`
        *, 
        author:profiles!posts_author_id_fkey(*), 
        community:communities(*), 
        comments:comments!comments_post_id_fkey(*), 
        votes:post_votes(user_id, vote_type), 
        bookmarks:bookmarks(*), 
        post_flairs(flairs(*))
        `]"
        :items-per-page="10"
        :order-by="{ column: 'created_at', ascending: false }"
        @vote="handleVote"
      />
    </template>

    <template #right-sidebar>
      <PopularPosts :popular-posts="popularPosts"/>
      <CommunityGuidelines/>
    </template>
  </ForumLayout>
</template>


<script setup lang="ts">
import { useToast } from 'vue-toastification';
import ForumLayout from "~/layouts/forum.vue";
import { useVote } from '~/composables/useVotes';
import type { Community, Post } from '~/types/utility.ts';
import PostFeed from '~/components/forum/post/post-feed.vue';
import ForumNavbar from '~/components/header/forum-navbar.vue';
import PopularPosts from '~/components/forum/post/popular-posts.vue';
import JoinedCommunities from '~/components/forum/community/joined-communities.vue';
import CommunityGuidelines from "~/components/forum/community/community-guidelines.vue";

definePageMeta({
  middleware: ['clean-oauth']
});

const { joinCommunity, leaveCommunity } = useCommunityMembership();


// Reactive state
const posts = ref<Post[]>([])
const communities = ref<Community[]>([])

const toast = useToast();
const user = useSupabaseUser();
const { votePost } = useVote();

// Static data
const popularPosts = [
  { title: 'Quantum Computing Breakthrough', community: 'm/QuantumPhysics', votes: '2.8K' },
  { title: 'CRISPR Gene Editing Success', community: 'm/Genetics', votes: '1.9K' },
  { title: 'New Exoplanet Discovery', community: 'm/Astronomy', votes: '3.4K' },
]

const { data, refresh: refreshCommunities, error } = await useAsyncData(
  'communities', 
  async () => {
    const response = await $fetch<{data : Community[]}>('/api/communities');
    // console.log('communities', response.data);
    return response?.data;
  }
);


if (error.value) {
  toast.error('An error occurred while trying to fetch communities');
}

communities.value = data.value ?? [];


const handleVote = (postId: string, voteType: 'up' | 'down') => {
  votePost(posts.value as Post[], postId, voteType);
};

const handleJoinCommunity = async (communityId: string) => {
  if (!user.value) {
    toast.error('You need to be logged in to join a community.')
    return;
  }

  const community = communities.value?.find(c => c.id === communityId);
  if (!community) return;

  try {
    if (community.is_joined) {
      await leaveCommunity(communityId);
      toast.success(`Left ${community.name}`);
      refreshCommunities();
    } else {
      await joinCommunity(communityId);
      toast.success(`Joined ${community.name}`);
    }

    community.is_joined = !community.is_joined;
  } catch (err) {
    toast.error(`Failed to update membership. Please try again.`);
    console.error(err);
  }
}

const joinedCommunities = computed(() =>
  (communities.value as Community[])?.filter(c =>
    Array.isArray(c.community_members) &&
    c.community_members.some(m => m.user_id === user.value?.id)
  ) || []
);

const unjoinedCommunities = computed(() =>
  (communities.value as Community[])?.filter(c =>
    Array.isArray(c.community_members) &&
    !c.community_members.some(m => m.user_id === user.value?.id)
  ) || []
);
</script>