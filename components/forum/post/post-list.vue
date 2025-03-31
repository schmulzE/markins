<template>
  <div class="bg-base-100 h-full w-full" dark-theme="light">
    <ul role="list" class="p-4 space-y-4">
      <li v-for="post in posts" :key="post.id" class="flex justify-between gap-x-6 border-b pb-4 border-base-300">
        <div class="flex justify-between gap-x-6">
          <div class="flex gap-x-4">
            <VoteButton :target-id="post.id" target-type="post"/>
            <div class="min-w-0 flex-auto">
              <div class="flex">
                <div>
                  <NuxtLink :to="`/profile/${post.profiles.username}`">
                    <div v-if="post.profiles?.avatar_url">
                      <img class="h-6 w-6 flex-none rounded-full bg-gray-50 avatar object-cover" :src="avatarUrls[post.id]" alt="user avatar">
                    </div>
                    <div v-else>
                      <i class="i-ri-account-circle-fill w-6 h-6 bg-gray-300" />
                    </div>
                  </NuxtLink>
                </div>
                <NuxtLink 
                  v-if="post.profiles.username" 
                  :to="`/profile/${post.profiles.username}`" 
                  class="text-sm font-semibold leading-6 ml-1"
                >
                  {{ post.profiles.username }}
                </NuxtLink>
                <p v-else class="text-md font-semibold leading-6">{{ post.profiles.email }}</p>
                <p class="text-xs font-semibold ml-1 leading-6 text-gray-500">
                  asked <time :datetime="post.updated_at!">{{ formatDateTime(post.updated_at!) }}</time>
                </p>
              </div>
              <NuxtLink 
                :to="`/post/${post.id}/${formatTitle(post?.title?.toLowerCase())}`" 
                class="text-lg mb-2 font-medium ml-1"
              >
                {{ post.title }}
              </NuxtLink>
              <p class="text-base leading-5 text-content">{{ post.content }}</p>
              <img 
                v-show="post.image_url" 
                class="w-full h-72 object-cover mt-4 rounded-md"  
                :src="postImages[post.id]" 
                alt="post image" 
              >
              <div class="flex">
                <div v-for="tag in post.tags" :key="tag?.id" class="mt-4 mr-2">
                  <TagLink 
                    :id="tag.id"
                    :text="tag.title!" 
                  />
                </div>
              </div>
              <div class="flex gap-x-4 mt-4">
                <button class="flex">
                  <i class="i-ph-chat-centered-bold text-xl text-slate-400"/>
                  <span class="text-sm">{{ post.comments.length }} comments</span>
                </button>
                <button class="flex">
                  <i class="i-ph-share-fat text-xl text-slate-400"/>
                  <span class="text-sm">share</span>
                </button>
                <BookmarkButton :post-id="post.id"/>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import TagLink from '../tag/taglink.vue';
import type { Posts } from '~/types/utility';
import { useToast } from 'vue-toastification';
import VoteButton from '../vote/vote-button.vue';
import BookmarkButton from '../bookmark/bookmark-button.vue';
import { formatTitle, formatDateTime } from '@/utils/formatters';

const toast = useToast();
const client = useSupabaseClient();
const props = defineProps<{ posts: Posts[] }>();
const avatarUrls = ref<Record<string, string>>({});
const postImages = ref<Record<string, string>>({});

const downloadImages = async () => {
  try {
    if (props.posts) {
      for (const post of props.posts) {
        if (post.profiles?.avatar_url) {
          const { data, error } = await client.storage.from('avatars').download(post.profiles.avatar_url);
          if (error) throw error;
          avatarUrls.value[post.id] = URL.createObjectURL(data);
        }

        if (post.image_url) {
          const { data, error } = await client.storage.from('images').download(post.image_url);
          if (error) throw error;
          postImages.value[post.id] = URL.createObjectURL(data);
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      toast.error('Failed to download images');
    }
  }
};

// console.log('posts', props.posts);

watchEffect(() => {
  if (props.posts.length) {
    downloadImages();
  }
});
</script>

<style>
.text-content {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0.5rem;
}
</style>