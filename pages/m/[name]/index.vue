<script lang="ts" setup>
import { useToast } from "vue-toastification";
import ForumLayout from "~/layouts/forum.vue";
import type { NestedResponse } from '~/types/utility';
import Accordion from "~/components/ui/accordion.vue";
import type { Database, Tables } from "~/types/database.types";
import InfiniteScroll from "~/components/ui/infinite-scroll.vue";
import OnlineMembersCounter from "~/components/forum/community/online-members-counter.vue";


type Community = NestedResponse<
  Tables<'communities'> & { community_members: Tables<'community_members'>[] },
  'id'
>;

const rules = [
  {
    id: "1",
    title: 'No offensive behavior, insults or attacks',
    contents: [{ name :'We encourage a diverse community in which members feel safe and have a voice. Refer to our Community Standards for a full description.'}],
    open: false
  },
  {
    id: "2",
    title: 'Make your post clear and comprehensive',
    contents: [{ name: 'Posts that lack insight or effort will be removed. (ex: questions which are easily googled)'}],
    open: false
  },
  {
    id: "3",
    title: 'Posts without appropriate tag in title will be removed',
    contents: [{ name: 'We encourage a diverse community in which members feel safe and have a voice. Refer to our Community Standards for a full description.'}],
    open: false
  },
  {
    id: "4",
    title: 'Limit self-promotion',
    contents: [{ name: 'Comments and posts should be first and foremost about topics of interest to ML observers and practitioners. Limited self-promotion is tolerated, but the sub is not here as merely a source for free advertisemen'}],
    open: false
  },
]

const route = useRoute();
const toast = useToast();
const loading = ref(false);
const isJoined = ref(false);
const buttonText = ref('join');
const user =  useSupabaseUser();
const client = useSupabaseClient<Database>();
const { initialize, cleanup, updateCommunityPresence } = usePresence();

const { data: fetchData } = await useFetch<{ data: Community }>(`/api/communities/${route.params.name}`);
const response = fetchData?.value?.data || null;
const community = response;

async function joinCommunity(communityId: string) {
  try {
    loading.value = true;
    const { data, error } = await client.rpc('join_community', {
      p_profile_id: user?.value?.id as string, // Assuming the user is logged in
      p_community_id: communityId
    })

    if (error) throw error

    if (data) {
      isJoined.value = true
      buttonText.value = 'joined'
      toast.success({ message: 'Joined community' });
    } else {
      // Handle unsuccessful join
      toast.error('An error occured, please try again');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error joining community:', error)
    }
    // Handle error (e.g., show an error message to the user)
  }finally{
    loading.value = false;
  }
}

const leaveCommunity = async (communityId: string) => {
  try {
    loading.value = true;
    const { error } = await client.rpc('leave_community', {
      p_profile_id: user?.value?.id as string,
      p_community_id: communityId
    })

    if (error) throw error

  } catch (error) {
    if (error instanceof Error) {
      toast.error('Error leaving community')
    }
    // Handle error (e.g., show error message to user)
  }finally{
    loading.value = false;
  }
}
  
const checkMembership = async () => {
  try {
    const { data, error } = await client
      .from('community_members')
      .select('*')
      .eq('profile_id', user?.value?.id ?? '')
      .eq('community_id', community?.id ?? '')
      .maybeSingle()

    if (error && error.code !== 'PGRST116') throw error
    isJoined.value = !!data
    buttonText.value = isJoined.value ? 'joined' : 'join'
  } catch {
    toast.error('Error checking membership')
  }
}

const handleCommunityAction = (communityId: string) => {
  if (!isJoined.value) {
    joinCommunity(communityId)
    queueNotification(communityId)
  }else {
    leaveCommunity(communityId)
  }
}


const queueNotification = async (communityId: string, postId = null) => {
  try {
    const { error } = await client.rpc('queue_community_notification', {
      p_community_id: communityId,
      p_post_id: postId!
    })

    if (error) throw error
  } catch(error)  {
    if (error instanceof Error) {
      throw new Error('Error queueing notification:', error);
    } 
  }
}

// Call this when a user joins a community or a new post is created
checkMembership();

// Update presence when entering community
onMounted(() => {
  initialize();

  if (community?.id) {
    updateCommunityPresence(community?.id as string, 'online')
  }
})

onUnmounted(() => {
  cleanup();
})
</script>

<template>
  <ForumLayout>
    <template #main>
      <div class="mt-8 relative">
        <div class="bg-base-200 text-accent-color p-8 rounded-md" />
        <div class="-mt-8 ml-4 w-full max-w-[1040px] flex justify-between items-center">
          <div class="avatar">
            <div class="w-20 rounded-full">
              <img :src="`/images/${community?.name === 'GeneralScience' ? 'general-science.jpg' : community?.name + '.png'}`">
            </div>
            <p class="self-end text-2xl font-bold mb-2 ml-2">m/{{ community?.name }}</p>
          </div>
          <div class="flex gap-4 mt-10">
            <NuxtLink
              :disabled="!isJoined"
              :to="`/m/${route.params.name}/create`"
              class="disabled:bg-base-200 disabled:cursor-not-allowed border p-2 rounded-full flex items-center"
            >
              <i class="i-ri-add-line text-2xl" />
              create a post
            </NuxtLink>
            <button
              class="border bg-[seagreen] text-white rounded-full px-4"
              :disabled="loading"
              @click="handleCommunityAction(community?.id!)"
            >
              {{ buttonText }}
            </button>
          </div>
        </div>
        <div class="flex relative ">
          <div class="mt-8 max-w-3xl flex-1">
            <!-- <PostViewHeader /> -->
            <InfiniteScroll
              table-name="posts"
              :columns="['*', 'profiles!posts_profile_id_fkey(*)', 'comments(id, content, profile_id, post_id)', 'post_tags(*)', 'tags(*)']"
              :items-per-page="10"
              :equal-to="{ column: 'community_id', value: community?.id! }"
              :order-by="{ column: 'created_at', ascending: true }"
            />
          </div>

          <div class="w-full max-w-xs px-2 sticky pt-16 h-[700px] -top-6 overflow-y-auto">
            <div class="bg-base-200 p-3 rounded-lg">
              <div class="flex gap-x-2">
                <div class="avatar">
                  <div class="w-5 rounded-full bg-white">
                    <img src="/images/mathematics.png" >
                  </div>
                </div>
                <nuxt-link to="" class="text-sm">{{ community?.name }}</nuxt-link>
              </div>
              <nuxt-link to="" class="text-sm py-1.5 font-medium block">{{ community?.description }}</nuxt-link>
              <div class="flex justify-between">
                <div class="flex flex-col">
                  <span>{{ community?.community_members?.length }}</span>
                  <span class="text-xs">members</span>
                </div>
                <OnlineMembersCounter :community-id="community?.id!" />
                <div class="flex flex-col">
                  <span>Top 1%</span>
                  <span class="text-xs">rank by size</span>
                </div>
              </div>

              <h4 class="uppercase mt-8 mb-4">Rules</h4>
              <Accordion class="bg-base-200" :content="rules" />
              <h4 class="uppercase my-4">tags</h4>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ForumLayout>
</template>