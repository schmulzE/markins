<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div class="flex h-16 items-center justify-between px-4">
        <NuxtLink to="/posts" class="ml-4">
          <img src="/svg/markins-logo.svg" class="h-8 hidden md:block" >
          <img src="/svg/markins.svg" class="h-7 md:hidden" >
        </NuxtLink>

        <nav class="flex items-center space-x-4">
          <NuxtLink to="/posts" class="text-sm font-medium hover:text-[#297D4E] transition-colors">
            Posts
          </NuxtLink>
          <NuxtLink to="/communities" class="text-sm font-medium hover:text-[#297D4E] transition-colors">
            Communities
          </NuxtLink>
        </nav>
      </div>
    </header>

    <div class="px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- User Info Sidebar -->
        <div class="lg:col-span-1 space-y-4">
          <div class="card bg-base-100 shadow border border-gray-300 p-4">
            <div class="p-6">
              <div class="text-center space-y-4">
                <div class="mx-auto">
                  <div v-if="user?.avatar_url" class="avatar">
                    <div class="w-24 rounded-full">
                      <img :src="getImageUrl(user?.avatar_url, 'avatars') || '/svg/placeholder.svg'" class="rounded-full" alt="User Avatar">
                    </div>
                  </div>
                  <div v-else class="avatar avatar-placeholder">
                    <div class="bg-gray-300 text-neutral-content w-24 rounded-full">
                      <span class="text-3xl">{{ user?.display_name?.split(' ').map(n => n[0]).join('') }}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div class="flex items-center justify-center space-x-2 mb-2">
                    <h1 class="text-2xl font-bold">{{ user?.display_name }}</h1>
                    <i v-if="user?.is_verified" class="inline i-lucide-verified w-4 h-4 bg-[#297D4E]"/>
                  </div>
                  <p class="text-gray-500">u/{{ user?.username }}</p>
                </div>

                <div class="flex justify-center space-x-2">
                  <NuxtLink
                  :to="{
                    path: '/settings/user',
                    query: { username: user?.username }
                  }"
                    class="btn btn-outline border-gray-200"
                    >
                    <i class="i-lucide-settings w-4 h-4"/>
                  </NuxtLink>
                  <button class="btn bg-[#297D4E] hover:bg-[#1f5a37] text-white" @click="openChatModal">
                    <i class="h-4 w-4 mr-2 i-lucide-mail" />
                    Message
                  </button>
                </div>

                <div v-if="user?.badges?.length! > 0" class="space-y-2">
                  <div 
                    v-for="(badge, index) in user?.badges" 
                    :key="index" 
                    class="bg-[#297D4E]/10 text-[#297D4E] badge"
                  >
                    <i class="h-3 w-3 mr-1 i-lucide-award" />
                    {{ badge }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card bg-base-100 shadow border border-gray-300 p-4 space-y-4">
            <div class="text-lg">About</div>
            <div class="space-y-4">
              <p class="text-sm text-gray-500">{{ user?.bio }}</p>

              <div class="space-y-2 text-sm">
                <div class="flex items-center space-x-2">
                  <i class="h-4 w-4 text-gray-500 i-lucide-calendar" />
                  <span>Joined {{ user?.created_at ? new Date(user.created_at).toLocaleString('en-US', { month: 'long', year: 'numeric' }) : '' }}</span>
                </div>

                <div v-if="user?.location" class="flex items-center space-x-2">
                  <i class="h-4 w-4 text-gray-500 i-lucide-map-pin" />
                  <span>{{ user?.location }}</span>
                </div>

                <div v-if="user?.website" class="flex items-center space-x-2">
                  <i class="h-4 w-4 text-gray-500 i-lucide-globe" />
                  <a :href="user?.website" class="text-[#297D4E] hover:underline" target="_blank">
                    {{ user?.website }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="card bg-base-100 shadow border border-gray-300 p-4 space-y-4">
            <div class="text-lg flex items-center">
              <i class="h-5 w-5 mr-2 text-[#297D4E] i-lucide-trophy" />
              Karma
            </div>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm">Total Karma</span>
                <span class="font-bold text-[#297D4E]">{{ user?.karma?.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm">Post Karma</span>
                <span class="font-medium">{{ user?.post_karma?.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm">Comment Karma</span>
                <span class="font-medium">{{ user?.comment_karma?.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-2 card p-2">
          <div class="tabs tabs-box gap-2 overflow-hidden">
            <label
              class="tab flex items-center justify-center gap-2 cursor-pointer px-24 ml-6"
            >
              <input
                type="radio"
                class="hidden"
                name="my_tabs_6"
                checked="true"
              >
              <span>Posts</span>
            </label>

            <div class="tab-content bg-base-200 p-6 space-y-4">
              <div v-if="!posts.length">
                <div class="card shadow border border-gray-300 p-4 bg-base-100">
                  <div class="p-8 text-center">
                    <i class="h-12 w-12 mx-auto text-gray-500 mb-4 i-lucide-file-text" />
                    <h3 class="text-lg font-semibold mb-2">No posts yet</h3>
                    <p class="text-gray-500">Posts you created will appear here</p>
                  </div>
                </div>
              </div>
              <div
                v-for="post in posts" 
                v-else
                :key="post.id" 
                class="hover:shadow-md transition-all duration-300 shadow border border-gray-300 bg-base-100"
              >
                <div class="p-4 ">
                  <div class="flex items-center space-x-2 mb-2 ">
                    <div class="text-sm">{{ post.communityIcon }}</div>
                    <NuxtLink
                      :to="`/m/${post.community.slice(2)}`"
                      class="text-sm font-medium text-[#297D4E] hover:underline"
                    >
                      m/{{ post.community }}
                    </NuxtLink>
                    <span class="text-xs text-gray-500">•</span>
                    <span class="text-xs text-gray-500">{{ post.timeAgo }}</span>
                  </div>

                  <h3 class="text-lg font-semibold mb-2 hover:text-[#297D4E] transition-colors cursor-pointer">
                    <div class="flex items-start space-x-2">
                      <i class="text-gray-400 mt-1" :class="getPostTypeIcon(post.type)" />
                      <span>{{ post.title }}</span>
                    </div>
                  </h3>

                  <div v-if="post.type === 'image' && post.imageUrl" class="relative w-full h-48 mb-3 rounded-lg overflow-hidden">
                    <img
                      :src="post.imageUrl || '/svg/placeholder.svg'"
                      alt="Post image"
                      class="object-cover w-full h-full"
                    >
                  </div>

                  <div v-if="post.type === 'link' && post.linkUrl" class="border border-gray-300 rounded-lg p-3 mb-3 bg-gray-50">
                    <div class="flex items-center space-x-2 text-sm text-[#297D4E]">
                      <i class="h-4 w-4 i-lucide-external-link" />
                      <a :href="post.linkUrl" class="hover:underline truncate" target="_blank">
                        {{ post.linkUrl }}
                      </a>
                    </div>
                  </div>

                  <p class="text-sm text-gray-700 mb-3 line-clamp-2">{{ post.content }}</p>

                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <div class="flex items-center space-x-1">
                      <i class="h-4 w-4 i-lucide-chevron-up" />
                      <span>{{ post.upvotes }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <i class="h-4 w-4 i-lucide-message-square" />
                      <span>{{ post.comments }}</span>
                    </div>
                    <button  class="btn btn-ghost btn-sm h-8 px-2">
                      <i class="h-4 w-4 mr-1 i-lucide-share-2" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <label
              class="tab flex items-center justify-center gap-2 cursor-pointer px-24"
            >
              <input
                type="radio"
                class="hidden"
                name="my_tabs_6"
              >
              <span>Comments</span>
            </label>
            <div class="tab-content bg-base-200 p-6 space-y-4">
              <div v-if="!comments.length">
                <div class="card shadow border border-gray-300 p-4 bg-base-100">
                  <div class="p-8 text-center">
                    <i class="h-12 w-12 mx-auto text-gray-500 mb-4 i-lucide-file-text" />
                    <h3 class="text-lg font-semibold mb-2">No comments yet</h3>
                    <p class="text-gray-500">Comments you created will appear here</p>
                  </div>
                </div>
              </div>
              <div 
                v-for="comment in comments"
                v-else 
                :key="comment.id" 
                class="hover:shadow-md transition-all duration-300 shadow border border-gray-300 bg-base-100 "
              >
                <div class="p-4">
                  <div class="flex items-center space-x-2 mb-2">
                    <i class="h-4 w-4 text-gray-500 i-lucide-message-square" />
                    <span class="text-sm text-gray-500">Comment on</span>
                    <NuxtLink to="#" class="text-sm font-medium text-[#297D4E] hover:underline">
                      {{ comment.postTitle }}
                    </NuxtLink>
                    <span class="text-xs text-gray-500">in m/{{ comment.community }}</span>
                    <span class="text-xs text-gray-500">•</span>
                    <span class="text-xs text-gray-500">{{ comment.timeAgo }}</span>
                  </div>

                  <p class="text-sm text-gray-700 mb-3">{{ comment.content }}</p>

                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <div class="flex items-center space-x-1">
                      <i class="i-lucide-chevron-up h-4 w-4" />
                      <span>{{ comment.upvotes }}</span>
                    </div>
                    <button class="btn btn-ghost h-8 px-2">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <label
              class="tab flex items-center justify-center gap-2 cursor-pointer px-24"
            >
              <input
                type="radio"
                class="hidden"
                name="my_tabs_6"
              >
              <span>Saved</span>
            </label>
            <div class="tab-content bg-base-200 p-6 ">
              <div class="card shadow border border-gray-300 p-4 bg-base-100">
                <div class="p-8 text-center">
                  <i class="h-12 w-12 mx-auto text-gray-500 mb-4 i-lucide-bookmark" />
                  <h3 class="text-lg font-semibold mb-2">No saved posts yet</h3>
                  <p class="text-gray-500">Posts you save will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { useToast } from 'vue-toastification';
import type { Profile } from '~/types/utility';
import useModalStore from '~/stores/useModalStore';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime)

const toast = useToast();
const route = useRoute();
const store = useModalStore();

const user = ref<Profile | null>(null);
const username = route.params.username as string;

const { getImageUrl } = useImageHandler();

const { data, error } = await useAsyncData(
  'profile', 
  async () => {
    const response = await $fetch<{data : Profile}>(`/api/user/${username}`);
    return response?.data;
  }
);


if (error.value) {
  toast.error('An error occurred while trying to fetch this user');
}

user.value = data.value;

const posts = computed(() => {
  return user.value?.posts?.map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    community: post.community.name,
    communityIcon: post.community.icon,
    timeAgo: dayjs(post.created_at).fromNow(),
    upvotes: post.upvotes ?? 0,
    comments: post.comment_count ?? 0,
    type: post.post_type,
    imageUrl: post.image_url || "/svg/placeholder.svg?height=200&width=300",
    linkUrl: post.link_url || undefined
  })) ?? [];
});

const comments = computed(() => {
  return user.value?.comments?.map((comment) => ({
    id: comment.id,
    content: comment.content,
    postTitle: comment.post.title,
    community: comment.post.community.name,
    timeAgo:  dayjs(comment.created_at).fromNow(),
    upvotes: comment.upvotes ?? 0
  })) ?? [];
});

// State
// const user = ref({
//   username: 'sarah_chen',
//   displayName: "Dr. Sarah Chen",
//   avatar: "/svg/placeholder.svg",
//   joinDate: "January 2022",
//   karma: 15420,
//   postKarma: 12340,
//   commentKarma: 3080,
//   bio: "Quantum physicist specializing in quantum error correction and quantum computing. PhD from MIT. Currently researching at IBM Quantum Network.",
//   location: "Boston, MA",
//   website: "https://sarahchen-quantum.com",
//   badges: ["Verified Researcher", "Top Contributor", "Gold Award Winner"],
// })


const getPostTypeIcon = (type: string) => {
  switch (type) {
    case "image":
      return "i-lucide-image h-4 w-4"
    case "link":
      return "i-lucide-link h-4 w-4"
    default:
      return "i-lucide-file-text h-4 w-4"
  }
}

function openChatModal() {
  store.openModal({ 
    component: markRaw(defineAsyncComponent(() => import('~/components/forum/message/message-modal.vue'))), 
    props: {
      classes: "fixed w-1/2 sm:max-w-md top-[50%] left-[50%] p-6 h-auto transform translate-x-[-50%] translate-y-[-50%]", 
      overlayClass: 'bg-gray-900/90',
      recipient: {
        id: user.value?.id,
        username: user.value?.username,
        displayName: user.value?.display_name,
        avatar: user.value?.avatar_url
      }
    }
  });
}
</script>