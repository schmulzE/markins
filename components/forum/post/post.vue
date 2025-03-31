<template>
  <div class="group border-slate-300 p-8 divide-gray-300 bg-base-100 mt-8">
    <div class="flex justify-between gap-x-4">
      <div class="flex gap-x-4">
        <VoteButton :target-id="post.id" target-type="post"/>
        <div class="min-w-0 flex-auto">
          <div class="flex">
            <div>
              <NuxtLink :to="`/profile/${post.profiles.username}`" class="">
                <div v-if="post.profiles.avatar_url">
                  <img class="h-6 w-6 flex-none rounded-full" :src="avatarUrl!" alt="user avatar" >
                </div>
                <div v-else>
                  <span class="i-ri-account-circle-fill w-6 h-6 bg-gray-300" />
                </div>
              </NuxtLink>
            </div>
            <NuxtLink 
            v-if="post.profiles.username" 
            :to="`/profile/${post.profiles.username}`" 
            class="text-sm font-semibold leading-6 ml-2"
            >
              {{ post.profiles.username }}
            </NuxtLink>
            <p v-else class="text-md font-semibold leading-6">{{ post.profiles.email }}</p>
            <p class="text-xs font-semibold ml-1 leading-6 text-gray-500">
              asked <time :datetime="post.updated_at!">{{ dateTime(post.updated_at!) }}</time>
            </p>
            <NuxtLink 
            v-if="user && user.id === post.profiles.id" 
            :to="`/post/${post.id}/edit`" 
            class="text-blue-500 hidden group-hover:block text-xs text-[12px] mt-1.5 mx-2">
            Edit
            </NuxtLink>
            <a 
            v-if="user && user.id === post.profiles.id" 
            class="text-red-500 hidden group-hover:block text-xs mt-1.5 mr-2 cursor-pointer"
            @click="deletePost(post.image_url!)" 
            >
            Delete
          </a>
          </div>
          <h1 class="text-xl my-2 font-medium">{{ post.title }}</h1>
          <p class="mb-2 text-base leading-5 ">
           {{ post.content }}
          </p>
          <img 
            v-show="post.image_url" 
            class="w-full h-80 object-cover mt-4 rounded-md"  
            :src='postImage!'
            alt="post image" 
            >
          <div class="flex">
            <div v-for="tag in post.tags" :key="tag.id" class="mt-6 mr-2">
              <Tag :id="tag.id" :text="tag.title!"  />
            </div>
          </div>
          <div class="flex gap-x-4 mt-4">
           <button class="flex">
            <span class="i-ri-chat-2-line text-xl text-slate-400" />
            <span class="text-sm">{{ comments.length }} comments</span>
          </button>
          <button class="flex">
            <span class="i-ph-share-fat text-xl text-slate-400" />
            <span class="text-sm">share</span>
          </button>
          <BookmarkButton :post-id="post.id"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import Tag from '../tag/taglink.vue';
import VoteButton from '../vote/vote-button.vue';
import relativeTime from 'dayjs/plugin/relativeTime';
import BookmarkButton from '../bookmark/bookmark-button.vue';
import type { Posts, Comments } from '~/types/utility';

const client = useSupabaseClient();
const emit = defineEmits(['delete-post'])
const props = defineProps<{
  post: Posts;
  imageUrl?: string;
  user?: { id: string };
  comments: Comments[];
}>();

dayjs.extend(relativeTime);

const dateTime = (value: string) => {
  return dayjs(value).fromNow();
}

const deletePost = (imagePath:string) => {
  emit('delete-post', imagePath)
}

const avatarUrl = ref<string | null>(null)
const postImage = ref<string | null>(null)

const downloadImages = async () => {
  try {
    if (props.post.profiles?.avatar_url) {
      const { data, error } = await client.storage.from('avatars').download(props.post.profiles.avatar_url);
      if (error) throw error;
      avatarUrl.value = URL.createObjectURL(data);
    }

    if (props.post.image_url) {
      const { data, error } = await client.storage.from('images').download(props.post.image_url);
      if (error) throw error;
      postImage.value = URL.createObjectURL(data);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Failed to download images');
    }
  }
};


onMounted(()=> {
  downloadImages()
});
</script>

<style scoped>
#parent .hidden-child{
    visibility: hidden;
}

#parent:hover .hidden-child{
    visibility: visible;
}
</style>