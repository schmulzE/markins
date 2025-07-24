<script lang="ts" setup>

interface UserPost {
  id: string;
  title: string;
  content: string | null;
  community: string;
  communityIcon: string | null;
  communitySlug: string;
  timeAgo: string;
  upvotes: number;
  comments: number;
  type: string;
  imageUrl: string;
  linkUrl: string | undefined;
};

defineProps<{
  posts: UserPost[]
}>();

const { getImageUrl } = useImageHandler();


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

</script>

<template>
  <div v-if="!posts.length">
    <div class="card border border-gray-300 dark:border-base-100 p-4 bg-base-100">
      <div class="p-8 text-center">
        <i class="h-12 w-12 mx-auto text-gray-500 mb-4 i-lucide-file-text" />
        <h3 class="text-lg font-semibold mb-2">No posts yet</h3>
        <p class="text-gray-500">Posts you created will appear here</p>
      </div>
    </div>
  </div>
  <div 
  v-else
  class="space-y-4"
  >
  <div
    v-for="post in posts" 
    :key="post.id" 
    class="hover:shadow-md shadow border border-gray-300 dark:border-base-100 bg-base-100"
  >
    <div class="p-4 ">
      <div class="flex items-center space-x-2 mb-2 ">
        <div class="text-sm">{{ post.communityIcon }}</div>
        <NuxtLink
          :to="`/m/${post.communitySlug}`"
          class="text-sm font-medium text-[#297D4E] hover:underline"
        >
          m/{{ post.community }}
        </NuxtLink>
        <span class="text-xs text-gray-500 dark:text-base-content">•</span>
        <span class="text-xs text-gray-500 dark:text-base-content">{{ post.timeAgo }}</span>
      </div>

      <h3 class="text-lg font-semibold mb-2 hover:text-[#297D4E] transition-colors cursor-pointer">
        <div class="flex items-start space-x-2">
          <i class="text-gray-400 mt-1" :class="getPostTypeIcon(post.type)" />
          <span>{{ post.title }}</span>
        </div>
      </h3>

      <div v-if="post.type === 'image' && post.imageUrl" class="relative w-full h-48 mb-3 rounded-lg overflow-hidden">
        <img
          :src="getImageUrl(post.imageUrl, 'post-images') || '/svg/placeholder.svg'"
          alt="Post image"
          class="object-cover w-full h-full"
        >
      </div>

      <div v-if="post.type === 'link' && post.linkUrl" class="border border-gray-300 dark:border-base-100 rounded-lg p-3 mb-3 bg-gray-50">
        <div class="flex items-center space-x-2 text-sm text-[#297D4E]">
          <i class="h-4 w-4 i-lucide-external-link" />
          <a :href="post.linkUrl" class="hover:underline truncate" target="_blank">
            {{ post.linkUrl }}
          </a>
        </div>
      </div>

      <p class="text-sm text-gray-700 dark:text-base-content mb-3 line-clamp-2">{{ post.content }}</p>

      <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-base-content">
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
</template>
