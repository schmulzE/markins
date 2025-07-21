<template>
  <template v-if="posts.length < 0">
    <div class="text-center text-gray-500 py-12 bg-base-100">
      <i class="i-lucide-file-x h-10 w-10 mb-4 text-gray-400" />
      <div class="text-lg font-semibold mb-2">No posts found</div>
      <div v-if="filterBy">No posts found for the selected flair.</div>
      <div v-else>No posts available.</div>
    </div>
  </template>
  <div v-else class="space-y-4">
    <div
      v-for="post in posts"
      :key="post.id"
      class="group hover:shadow-md transition-all duration-300 card bg-base-100 border border-gray-300 dark:border-base-100"
    >
      <div class="p-0">
        <div class="flex">
          <!-- Voting Section -->
          <div class="hidden md:flex flex-col items-center p-4 bg-gray-100 dark:bg-base-200 rounded-l-lg">
            <div v-if="isModerator && isSelectMode" class="mb-3">
              <input
                type="checkbox"
                :checked="selectedPosts?.includes(post.id!)"
                class="rounded border-gray-300 text-[#297D4E] focus:ring-[#297D4E]"
                @change="() => handleSelectPost(post.id!)"
              >
            </div>
            <button
              class="btn-ghost btn-sm"
              :class="`p-1 h-8 w-8 ${post.user_vote === 'up' ? 'text-[#297D4E] bg-[#297D4E]/10' : 'text-gray-400 hover:text-[#297D4E]'}`"
              @click="emitVote(post.id!, 'up')"
              >
              <i class="h-5 w-5 i-lucide-chevron-up" />
            </button>
            <span
              :class="`text-sm dark:text-base-content font-medium py-1 ${
                post.user_vote === 'up'
                  ? 'text-[#297D4E]'
                  : post.user_vote === 'down'
                    ? 'text-red-500'
                    : 'text-gray-600'
              }`"
            >
              {{ post.upvotes! - post.downvotes! }}
            </span>
            <button
              class="btn-sm btn-ghost"
              :class="`p-1 h-8 w-8 ${post.user_vote === 'down' ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`"
              @click="emitVote(post.id!, 'down')"
            >
              <i class="h-5 w-5 i-lucide-chevron-down" />
            </button>
          </div>

          <!-- Post Content -->
          <div class="flex-1 p-4">
            <!-- Post Header -->
            <div class="flex items-center space-x-2 mb-2">
              <template v-if="route.path === `/m/${post.community?.slug}` && post.is_pinned">
                <i class="h-4 w-4 text-green-600 i-lucide-pin" />
                <div class="bg-green-100 badge text-green-800">Pinned</div>
              </template>
              <template v-else-if="route.path !== `/m/${post.community?.slug}`">
                <div v-if="post.community?.icon" class="text-sm hidden md:block">{{ post.community.icon }}</div>
                <NuxtLink
                  v-if="post.community"
                  :to="`/m/${post.community.slug}`"
                  class="text-sm font-medium text-[#297D4E] hover:underline"
                >
                  m/{{ post.community.name }}
                </NuxtLink>
              </template>
              <span v-if="post.community && route.path !== `/m/${post.community.slug}`" class="text-xs  text-gray-500 dark:text-base-content">•</span>
              <span class="text-xs text-gray-500 dark:text-base-content">Posted by</span>
              <NuxtLink :to="`/user/${post.author?.username}`" class="text-xs text-gray-500 hover:underline dark:text-base-content">
                u/{{ post.author?.display_name }}
              </NuxtLink>
              <span class="text-xs text-gray-500 dark:text-base-content">{{ dateTime(post.created_at!) }}</span>
            </div>

            <!-- Post Flairs -->
            <div v-if="Array.isArray(post.post_flairs) && post.post_flairs.length > 0" class="flex flex-wrap gap-1">
              <NuxtLink
                v-for="flair in post.post_flairs"
                :key="flair.flairs.id"
                :to="`/flair/${flair.flairs.name.toLowerCase()}`"
                class="bg-[#297D4E]/10 text-[#297D4E] badge mb-2"
              >
                {{ flair.flairs.name }}
              </NuxtLink>
            </div>

            <!-- Post Title -->
            <h3 class="text-lg font-semibold mb-2 group-hover:text-[#297D4E] transition-colors cursor-pointer text-wrap">
              <div class="flex items-start space-x-2">
                <div class="text-gray-400 mt-1">
                  <i :class="getPostTypeIcon(post.post_type!)" />
                </div>
                <NuxtLink :to="`/post/${post.id}`" class="truncate text-wrap">{{ post.title }}</NuxtLink>
              </div>
            </h3>

            <!-- Post Content -->
            <div class="mb-3">
              <div v-if="post.post_type === 'image' && post.image_url" class="relative w-82 md:w-full md:h-64 mb-3 rounded-lg overflow-hidden">
                <img
                  :src="getImageUrl(post.image_url, 'post-images') || '/svg/placeholder.svg'"
                  alt="Post image"
                  class="object-cover w-full h-full"
                >
              </div>

              <div v-if="post.post_type === 'link' && post.link_url" class="border border-gray-300 dark:border-base-200 rounded-lg p-3 mb-3 bg-gray-50 dark:bg-base-200">
                <div class="flex items-center space-x-2 text-sm text-[#297D4E]">
                  <i class="h-4 w-4 i-lucide-external-link" />
                  <a :href="post.link_url" class="hover:underline truncate" target="_blank">
                    {{ post.link_url }}
                  </a>
                </div>
              </div>

              <p class="text-sm text-gray-700 dark:text-base-content line-clamp-3 text-wrap">{{ post.content }}</p>
            </div>

            <!-- Post Actions -->
            <div class="flex items-center space-x-1 md:space-x-4 text-sm text-gray-500 dark:text-base-content">
              <button
              class="block md:hidden btn-ghost btn-sm"
              :class="`p-1 h-8 w-8 ${post.user_vote === 'up' ? 'text-[#297D4E] bg-[#297D4E]/10' : 'text-gray-400 hover:text-[#297D4E]'}`"
              @click="emitVote(post.id!, 'up')"
              >
              <i class="h-5 w-5 i-lucide-chevron-up" />
            </button>
            <span
              :class="`block md:hidden text-sm dark:text-base-content font-medium py-1 ${
                post.user_vote === 'up'
                  ? 'text-[#297D4E]'
                  : post.user_vote === 'down'
                    ? 'text-red-500'
                    : 'text-gray-600'
              }`"
            >
              {{ post.upvotes! - post.downvotes! }}
            </span>
            <button
              class="block md:hidden btn-sm btn-ghost"
              :class="`p-1 h-8 w-8 ${post.user_vote === 'down' ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`"
              @click="emitVote(post.id!, 'down')"
            >
              <i class="h-5 w-5 i-lucide-chevron-down" />
            </button>
              <button 
                class="btn-sm btn-ghost h-8 px-2 flex items-center hover:bg-gray-100 dark:hover:bg-transparent"
              >
                <i class="h-4 w-4 mr-2 i-lucide-message-square" />
                {{ post.comment_count }}
                <span class="hidden md:block">Comments</span>
              </button>

              <BookmarkButton :post-id="post.id" />

              <div v-show="route.path !== `/m/${post.community?.slug}` && route.path !== `/post/${post.id}`" class="dropdown dropdown-center">
                <div tabindex="0" role="button" class="btn btn-ghost hover:shadow-none border-none hover:bg-transparent bg-transparent">
                  <i class="h-4 w-4 i-lucide-more-horizontal" />
                </div>
                <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-28 p-2 shadow-sm">
                  <li>
                    <a class="flex items-center w-full" @click="$emit('hide-click', post.id)">
                      <i class="h-4 w-4 mr-2 i-lucide-eye" />
                      Hide
                    </a>
                  </li>
                  <li>
                     <a 
                      class="btn-ghost md:flex items-center h-8 px-2 hover:bg-gray-100 dark:hover:bg-transparent"
                      @click="$emit('share-click', post.id)"
                    >
                      <i class="h-4 w-4 mr-1 i-lucide-share-2" />
                      <span>Share</span>
                    </a>
                  </li>
                </ul>
              </div>

              <!-- Moderator Actions -->
              <div v-if="isModerator" class="flex items-center space-x-2">
                <template v-if="post.status === 'pending'">
                  <button
                    class="btn btn-outline text-green-600 hover:bg-green-50 h-7 px-2"
                    @click="() => handlePostAction(post.id!, 'approve')"
                  >
                    <i class="i-lucide-check-circle h-3 w-3 mr-1" />
                    Approve
                  </button>
                    <button
                    class="btn btn-outline text-red-600 hover:bg-red-50 h-7 px-2"
                    @click="() => handlePostAction(post.id!, 'remove')"
                  >
                    <i class="i-lucide-x-circle h-3 w-3 mr-1" />
                    Remove
                  </button>
                </template>

                <div class="dropdown dropdown-center">
                  <div tabindex="0" role="button" class="btn btn-ghost">
                    <i class="h-4 w-4 i-lucide-more-horizontal" />
                  </div>
                  <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-28 md:w-40 p-2 shadow-sm">
                    <li>
                      <a class="flex items-center w-full" @click="$emit('hide-click', post.id)">
                        <i class="i-lucide-pin h-4 w-4 mr-2" />
                        {{ post.is_pinned ? 'Unpin' : 'Pin' }} Post
                      </a>
                    </li>
                    <li>
                      <a class="flex items-center w-full" @click="$emit('post-action', post.id)">
                        <i class="i-lucide-lock h-4 w-4 mr-2" />
                        {{ post.is_locked ? 'Unlock' : 'Lock' }} Post
                      </a>
                    </li>
                    <li>
                      <a class="flex items-center w-full" >
                        <i class="i-lucide-hash h-4 w-4 mr-2" />
                        Add Flair
                      </a>
                    </li>
                    <li>
                      <a class="flex items-center w-full" >
                        <i class="i-lucide-user-x h-4 w-4 mr-2" />
                        Ban User
                      </a>
                    </li>
                    <li>
                      <a class="flex items-center w-full" >
                        <i class="i-lucide-flag h-4 w-4 mr-2" />
                        View Reports
                      </a>
                    </li>
                  </ul>
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
import type { Post } from '~/types/utility';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useImageHandler } from '~/composables/useImageHandler';
import BookmarkButton from '~/components/forum/bookmark/bookmark-button.vue';

dayjs.extend(relativeTime);

const props = defineProps<{
  postData: Post | Post[],
  isModerator?: boolean,
  isSelectMode?: boolean,
  selectedPosts?: string[]
  filterBy?: string; 
}>();

const emit = defineEmits([
  'vote',
  'share-click',
  'hide-click',
  'post-action',
  'select-post'
]);

const route =  useRoute();
const { getImageUrl } = useImageHandler();

const dateTime = (value: string) => {
  return dayjs(value).fromNow();
}

const posts = computed(() => 
  Array.isArray(props.postData) ? props.postData : [props.postData]
);

const getPostTypeIcon = (type: string) => {
  switch (type) {
    case 'image':
      return 'i-lucide-image'
    case 'link':
      return 'i-lucide-link'
    default:
      return 'i-lucide-file-text'
  }
};

const emitVote = (postId: string, direction:  'up' | 'down' | null) => {
  if (route.path === '/posts') {
    emit('vote', postId, direction);  // For parent expecting id and direction
  } else {
    emit('vote', direction);  // For parent expecting just direction
  }
};

const handlePostAction = (postId: string, status:  'approve' | 'remove') => {
  emit('post-action', postId, status)
};

const handleSelectPost = (postId: string) => {
 emit('select-post', postId)
};
</script>