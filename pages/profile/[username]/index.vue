<template>
  <div>
    <NuxtLayout name="forum">
      <template #main>
        <div
        class="w-full bg-base-100 border-neutral-300 h-full flex flex-col mt-12"
        >
          <div class="flex flex-col md:flex-row gap-2 mx-4 md:ml-2 md:h-24">
            <div class="avatar" >
              <div v-if="profile?.avatar_url" class="w-16 md:w-24 rounded-full">
                <img
                :src="avatarUrl"
                alt="profile image"
                >
              </div>
              <span v-else class=" i-ic-sharp-account-circle bg-gray-300 text-8xl rounded-full"/>
            </div>
            <div class="self-start md:self-center">
              <p class="font-bold text-xl">{{ profile?.username }}</p>
              <p class="text-sm text-gray-400">m/{{ profile?.username }}</p>
            </div>
          </div>
          <div class="block md:hidden m-4 p-2 bg-base-200 rounded-lg">
              <section class="flex-col">
                <p class="hidden md:block text-md">{{ profile?.username }}</p>
                <div class="flex gap-x-4 my-2">
                  <button 
                  v-if="canShare" 
                  class="flex items-center rounded-full gap-x-1 bg-blue-600 text-white py-1.5 px-2 text-sm"
                  @click="shareUserProfile(profile?.username as string)" 
                  >
                  <i class=" i-mdi-share-outline text-lg"/>
                  share</button>
                  <button
                  v-show="profile?.id !== user?.id"
                  class="flex items-center gap-x-1 rounded-full text-black bg-gray-300 py-1.5 px-2 text-sm"
                  @click="openChatModal" 
                  >
                    <i class=" i-ri-chat-3-line"/>
                    chat
                  </button>
                </div>
                <p class="text-xs">{{ profile?.about }}</p>
                <div class="flex justify-between text-xs mt-8 mx-2">
                <div class="text-center">
                  <p>{{ posts.length || 0 }}</p>
                  <h6 class="capitalize text-xs">posts</h6>
                </div>
                <div class="text-center">
                  <p>{{ comments.length || 0 }}</p>
                  <h6 class="capitalize text-xs">comments</h6>
                </div>
                <div class="text-center">
                  <p class="">1 June, 2024</p>
                  <h6 class="capitalize text-xs">Date Joined</h6>
                </div>
              </div>
            </section>
            <section class="gap-y-4 mt-4 py-4 border-t border-base-300">
              <h1 class="uppercase text-sm">Settings</h1>
              <ul class="space-y-4 my-4">
                <li>
                  <a 
                  class="flex justify-between text-sm items-center w-full cursor-pointer"
                  @click="editUsernameModal" 
                  >
                    <div>
                      <h4>Username</h4>
                      <p class="text-xs">change or edit your username</p>
                    </div>
                    <button><i class=" i-mdi-light-chevron-right text-2xl" /></button>
                  </a>
                </li>
                <li>
                  <a 
                  class="flex justify-between items-center text-sm w-full cursor-pointer"
                  @click="editUserDescriptionModal" 
                  >
                    <h4>About description</h4>
                    <button><i class=" i-mdi-light-chevron-right text-2xl" /></button>
                  </a>
                </li>
                <li>
                  <a 
                  class="flex justify-between text-sm items-center w-full cursor-pointer"
                  @click="avatarUploadModal" 
                  >
                    <div>
                      <h4>Avatar</h4>
                      <p class="text-xs">change your avatar</p>
                    </div>
                    <button><i class="i-mdi-light-chevron-right text-2xl" /></button>
                  </a>
                </li>
              </ul>
            </section>
          </div>

          <DynamicTab :tabs="tabs" />

        </div>
      </template>
      <template #aside>
        <div class="transition-transform -translate-x-full sm:translate-x-0 mt-12 -z-50 w-full" >
          <div class="h-full overflow-y-auto">
            <div class="p-2 bg-base-200 rounded-lg">
              <section class="flex-col">
                <p class="text-md">{{ profile?.username }}</p>
                <div class="flex gap-x-4 my-2">
                  <button 
                  v-if="canShare" 
                  class="flex items-center rounded-full gap-x-1 bg-blue-600 text-white py-1.5 px-2 text-sm"
                  @click="shareUserProfile(profile?.username as string)" 
                  >
                  <i class=" i-mdi-share-outline text-lg"/>
                  share</button>
                  <button
                  v-show="profile?.id !== user?.id"
                  class="flex items-center gap-x-1 rounded-full text-black bg-gray-300 py-1.5 px-2 text-sm"
                  @click="openChatModal" 
                  >
                    <i class=" i-ri-chat-3-line"/>
                    chat
                  </button>
                </div>
                <p class="text-xs">{{ profile?.about }}</p>
                <div class="flex justify-between text-xs mt-8 mx-2">
                <div class="text-center">
                  <p>{{ posts.length || 0 }}</p>
                  <h6 class="capitalize text-xs">posts</h6>
                </div>
                <div class="text-center">
                  <p>{{ comments.length || 0 }}</p>
                  <h6 class="capitalize text-xs">comments</h6>
                </div>
                <div class="text-center">
                  <p class="">1 June, 2024</p>
                  <h6 class="capitalize text-xs">Date Joined</h6>
                </div>
              </div>
            </section>
            <section class="gap-y-4 mt-4 py-4 border-t border-base-300">
              <h1 class="uppercase text-sm">Settings</h1>
              <ul class="space-y-4 my-4">
                <li>
                  <a 
                  class="flex justify-between text-sm items-center w-full cursor-pointer"
                  @click="editUsernameModal" 
                  >
                    <div>
                      <h4>Username</h4>
                      <p class="text-xs">change or edit your username</p>
                    </div>
                    <button><i class=" i-mdi-light-chevron-right text-2xl" /></button>
                  </a>
                </li>
                <li>
                  <a 
                  class="flex justify-between items-center text-sm w-full cursor-pointer"
                  @click="editUserDescriptionModal" 
                  >
                    <h4>About description</h4>
                    <button><i class=" i-mdi-light-chevron-right text-2xl" /></button>
                  </a>
                </li>
                <li>
                  <a 
                  class="flex justify-between text-sm items-center w-full cursor-pointer"
                  @click="avatarUploadModal" 
                  >
                    <div>
                      <h4>Avatar</h4>
                      <p class="text-xs">change your avatar</p>
                    </div>
                    <button><i class="i-mdi-light-chevron-right text-2xl" /></button>
                  </a>
                </li>
              </ul>
            </section>
          </div>
          </div>
        </div>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import {useToast} from 'vue-toastification';
import useModalStore from '~/stores/useModalStore';
import type { Tables } from '~/types/database.types';
import HybridFeed from '~/components/ui/hybrid-feed.vue';
import DynamicTab from '~/components/ui/dynamic-tab.vue';
import PostList from '~/components/forum/post/post-list.vue';
import CommentList from '~/components/forum/comment/comment-list.vue';
import type { Posts, Comments, BookmarkResponse, Profile } from '~/types/utility';

interface Content {
  id: string;
  title: string;
  content: string;
  profile_id: string;
  created_at: string;
  updated_at: string;
  image_url: string | null;
  community_id: string;
  bookmarks: Tables<'bookmarks'>[];
  comments: Comments[]; // Replace 'any' with a proper comment type if available
  profiles: Profile;
  tags: Tables<'tags'>[]; // Replace 'any' with a proper tag type if available
}

interface VoteItem {
  id: string;
  profile_id: string;
  target_id: string;
  target_type: string;
  vote_type: number;
  created_at: string;
  content: Content;
  post_id: string;
}

definePageMeta({
  layout: false,
});

const toast = useToast();
const route = useRoute();
const store = useModalStore();
const user = useSupabaseUser();
const client = useSupabaseClient();

const canShare = ref(false);
const avatarUrl = ref<string>();
const username = route.params.username;
const profile = ref<Profile | null>(null);

const {data, error} = await useFetch<Profile>(`/api/user/${username}`);
if(error.value !== null) toast.error('An error occured while trying to fetch this user\'s data');
profile.value = data.value;

const { data: bookmarks, error: bookmarksError } = await useFetch<BookmarkResponse[]>('/api/user/bookmarks')

if (bookmarksError.value) {
  throw new Error('Error fetching bookmarks:' + bookmarksError.value)
}

const transformBookmarksToHybridFeedItems = computed(() => {
  return bookmarks.value?.map(bookmark => {
    if (bookmark.post) {
      // This is a bookmarked post
      return {
        id: bookmark.id,
        profile_id: bookmark.post.profile_id,
        target_id: bookmark.post.id,
        target_type: 'post',
        created_at: bookmark.post.created_at,
        content: bookmark.post,
        post_id: bookmark.post.id
      }
    } else if (bookmark.comment) {
      // This is a bookmarked comment
      return {
        id: bookmark.id,
        profile_id: bookmark.comment.profile_id || '', // Might need to be fetched
        target_id: bookmark.comment.id,
        target_type: 'comment',
        created_at: bookmark.comment.created_at || '', // Might need to be fetched
        content: bookmark.comment,
        post_id: bookmark.comment.post_id,
        comment_id: bookmark.comment.id
      }
    }
    return null;
  }).filter(Boolean); // Remove null entries
})

const { data: voteResponse } = await useFetch<{ votes: VoteItem[] }>('/api/user/votes');

console.log('voteResponse', voteResponse.value?.votes);

// All votes with their types preserved
const allVotes = computed(() => voteResponse.value?.votes || []);

// Separated votes
const upvotes = computed(() => allVotes.value.filter(v => v.vote_type === 1));
const downvotes = computed(() => allVotes.value.filter(v => v.vote_type === -1));


const posts = computed(() => {
  return profile.value?.posts?.map((post) => ({
    ...post,
    profiles: {
      id: profile.value?.id,
      username: profile.value?.username,
      avatar_url: profile.value?.avatar_url,
      about: profile.value?.about,
      email: profile.value?.email,
      created_at: profile.value?.created_at,
      updated_at: profile.value?.updated_at,
    },
  })) || [];
}) as unknown as Posts[];

const comments = computed(() => {
  return profile.value?.comments?.map((comment) => ({
    ...comment,
    profiles: {
      id: profile.value?.id,
      username: profile.value?.username,
      avatar_url: profile.value?.avatar_url,
      about: profile.value?.about,
      email: profile.value?.email,
      created_at: profile.value?.created_at,
      updated_at: profile.value?.updated_at,
    },
  })) || [];
}) as unknown as Comments[]


const editUsernameModal  = () => {
  store.openModal({
    component:shallowRef(defineAsyncComponent(() => import('~/components/user/username-modal-form.vue') )), 
    props: {
      classes: "fixed w-[350px] top-[50%] left-[50%] p-4 h-auto transform translate-x-[-50%] translate-y-[-50%]", 
      overlayClass: 'bg-gray-50/50',
      username: profile.value?.username || ''
    },
    events: {
      "submit-username" : async (event: unknown) => {
        const username = event as string;
        await $fetch('api/user', {
          method: "PATCH",
          body: { username }
        })
      }
    }
  })
}

const avatarUploadModal  = () => {
  store.openModal({
    component:shallowRef(defineAsyncComponent(() => import('~/components/user/avatar-upload-modal.vue') )), 
    props: {
      classes: "fixed w-[250px] top-[50%] left-[50%] p-4 h-auto transform translate-x-[-50%] translate-y-[-50%]", 
      overlayClass: 'bg-gray-50/50',
      path: profile.value?.avatar_url ?? '',
      title: 'Avatar'
    }
  })
}

const editUserDescriptionModal = () => {
  store.openModal({ 
    component:shallowRef(defineAsyncComponent(() => import('~/components/user/profile-description-modal.vue'))), 
    props: {
      classes: "fixed w-[350px] top-[50%] left-[50%] p-6 h-auto transform translate-x-[-50%] translate-y-[-50%]", 
      overlayClass: 'bg-gray-50/50',
      description: profile.value?.about || ''
    },
    events: {
      "submit-description" : async (event: unknown) => {
        const newDescription = event as string;
        await $fetch('api/user/', {
          method: "PATCH",
          body: { newDescription }
        })
      }
    }
  });
}

function openChatModal() {
  store.openModal({ 
    component: shallowRef(defineAsyncComponent(() => import('~/components/chat/chat-panel.vue') )), 
    props: {classes: "fixed w-full max-w-2xl top-36 right-24 rounded-md h-[500px]", userIdProps: profile.value?.id}
  });
}

// async function signOut() {
//   try {
//     loading.value = true
//     let { error } = await client.auth.signOut()
//     if (error) throw error
//   } catch (error) {
//     if(error instanceof Error) {
//       toast.error(error.message)
//       return
//     }
//   } finally {
//     loading.value = false
//   }
// }

function fallbackShare(url: string) {
  navigator.clipboard.writeText(url)
    .then(() => alert('Link copied to clipboard!'))
    .catch(err => {throw new Error('Failed to copy: ' + err)});
}

function shareUserProfile(username: string) {
  const shareUrl = `${window.location.origin}/users/${username}`
  if (navigator.share) {
    navigator.share({
      title: `Check out ${username}'s profile`,
      text: `I found ${username}'s profile and thought you might be interested!`,
      url: shareUrl
    })
    .then(() => console.log('Successful share'))
    .catch((error) => {throw new Error('Error sharing: ' + error)});
  } else {
    fallbackShare(shareUrl);
  }
}

onMounted(async () => {
  canShare.value = !!navigator.share
})

const downloadImage = async () => {
  try {
    if(profile.value?.avatar_url) {
      const { data, error } = await client.storage.from('avatars').download(profile?.value.avatar_url)
      if (error) throw error
      avatarUrl.value = URL.createObjectURL(data)
    }
  } catch (error) {
    if(error instanceof Error){
      toast.error(error.message)
    }
  }
}

const tabs = ref([
  {
    id: 'post-list',
    title: 'Posts',
    content: shallowRef(PostList),
    componentProps: {
      posts: posts,
    }
  },
  {
    id: 'comment-list',
    title: 'Comments',
    content: shallowRef(CommentList),
    componentProps: {
      comments: comments,
    }
  },
  {
    id: 'saved',
    title: 'Saved',
    content: shallowRef(HybridFeed),
    componentProps: {
      items: transformBookmarksToHybridFeedItems.value,
    }
  },
  {
    id: 'up-voted',
    title: 'Upvotes',
    content: shallowRef(HybridFeed),
    componentProps: {
      items: upvotes.value,
    }
  },
  {
    id: 'down-voted',
    title: 'Downvotes',
    content: shallowRef(HybridFeed),
    componentProps: {
      items: downvotes.value,
    }
  }
])

onMounted(()=> {
  downloadImage()
});

</script>

<style scoped>

</style>