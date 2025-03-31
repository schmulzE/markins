<script setup lang="ts">
import dayjs from 'dayjs';
import DOMPurify from 'dompurify';
import useModalStore from '~/stores/useModalStore';
import Tag from '~/components/forum/tag/taglink.vue';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { Tables } from '~/types/database.types';
import type { Posts, Comments } from '~/types/utility';
import VoteButton from '../forum/vote/vote-button.vue';
import BookmarkButton from '../forum/bookmark/bookmark-button.vue';


dayjs.extend(relativeTime);


export interface TimelineItem {
  id: string;
  type: 'post' | 'comment';
  content: Posts | Comments;
  created_at: string;
  profile?: Tables<'profiles'>;
}

interface FeedItem {
  id: string
  profile_id: string
  target_id: string
  target_type: 'post' | 'comment'
  created_at: string
  content: Posts | Comments
}

interface Props {
  items?: FeedItem[] // Make items optional
}

const avatarUrls = ref<Record<string, string>>({});
const postImageUrls = ref<Record<string, string>>({});
const commentAvatarUrls = ref<Record<string, string>>({});

const dateTime = (value: string) => {
  return dayjs(value).fromNow();
}

const sanitizeHtml = (html: string) => {
  if (import.meta.client) {
    // DOMPurify is already imported at the top of the file
    return DOMPurify.sanitize(html);
  }
  return html;
};

const { downloadImage } = useStorage();

const store = useModalStore();
const user = useSupabaseUser();

const props = withDefaults(defineProps<Props>(), {
  items: () => [] // Default to an empty array if no items are provided;
})

const timelineItems = computed(() => {
  return props.items
    .filter(item => item.target_type === 'post' || item.target_type === 'comment')
    .map(item => {
      if (item.target_type === 'post') {
        const post = item.content as Posts
        return {
          type: 'post',
          content: post,
          created_at: post.created_at,
          id: post.id,
          profile: post.profiles,
          comments: post.comments,
          tags: post.tags,
        } as TimelineItem
      } else {
        const comment = item.content as Comments
        return {
          type: 'comment',
          content: comment,
          created_at: comment.created_at,
          id: comment.id,
          profile: comment.profiles
        } as TimelineItem
      }
    }).sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
})

// Group items by date
const groupedItems = computed(() => {
  const groups: Record<string, TimelineItem[]> = {}
  
  timelineItems.value.forEach(item => {
    const date = new Date(item.created_at!).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    if (!groups[date]) {
      groups[date] = []
    }
    
    groups[date].push(item)
  })
  
  return groups
})

// Process images when items change
watch(() => props.items, async (newItems) => {
  if (!newItems || newItems.length === 0) return;

  // Process all images in parallel
  await Promise.all(newItems.map(async (item) => {
    if (item.target_type === 'post') {
      const post = item.content as Posts
      
      // Download post avatar
      if (post.profiles?.avatar_url) {
        const url = await downloadImage(post.profiles.avatar_url, 'avatars')
        if (url) {
          avatarUrls.value[post.profiles.id] = url
        }
      }

      // Download post image
      if (post.image_url) {
        const url = await downloadImage(post.image_url, 'images')
        if (url) {
          postImageUrls.value[post.id] = url
        }
      }

      // Download comment avatars
      if (post.comments?.length) {
        await Promise.all(post.comments.map(async (comment) => {
          // Assuming comment has profile with avatar_url
          if (comment.profile_id && !commentAvatarUrls.value[comment.profile_id]) {
            // You might need to fetch profile data first
            const url = await downloadImage(`path-to-avatar/${comment.profile_id}`, 'avatars')
            if (url) {
              commentAvatarUrls.value[comment.profile_id] = url
            }
          }
        }))
      }
    }
  }))
}, { immediate: true })

// Clean up object URLs when component unmounts
onBeforeUnmount(() => {
  Object.values(avatarUrls.value).forEach(URL.revokeObjectURL)
  Object.values(postImageUrls.value).forEach(URL.revokeObjectURL)
  Object.values(commentAvatarUrls.value).forEach(URL.revokeObjectURL)
})

function openWarningModal(commentId: string) {
  store.openModal({ 
    component: markRaw(defineAsyncComponent(() => import('~/components/forum/comment/delete-confirmation-modal.vue'))), 
    props: {
      classes: "fixed w-1/2 top-[50%] left-[50%] p-6 h-auto transform translate-x-[-50%] translate-y-[-50%]", 
      overlayClass: 'bg-black bg-opacity-70', 
    },
    events: {
      deleteComment: async() => {
        await $fetch(`api/user/${commentId}`, {
          method: "DELETE",
        })
      },
    }
  });
}
</script>

<template>
  <div>
     <!-- eslint-disable-next-line vue/no-template-shadow -->
    <div v-for="(items, date) in groupedItems" :key="date">
      <div v-for="item in items" :key="item.id" >
        <!-- Posts Item -->
        <div v-if="item.type === 'post'" class="p-4">
          <div class="flex gap-x-4">
            <VoteButton :target-id="item.id" target-type="post"/>
            <div class="min-w-0 flex-auto">
              <div class="flex">
                <div>
                  <NuxtLink :to="`/profile/${item.profile?.username}`" class="">
                    <div v-if="item.profile?.avatar_url">
                      <img 
                      class="h-6 w-6 flex-none rounded-full" 
                      :src="avatarUrls[(item.content as Posts).profiles.id]"
                      alt="user avatar" 
                      >
                    </div>
                    <div v-else>
                      <span class="i-ri-account-circle-fill w-6 h-6 bg-gray-300" />
                    </div>
                  </NuxtLink>
                </div>
                <NuxtLink 
                v-if="item.profile?.username" 
                :to="`/profile/${item.profile.username}`" 
                class="text-sm font-semibold leading-6 ml-2"
                >
                  {{ item.profile?.username }}
                </NuxtLink>
                <p v-else class="text-md font-semibold leading-6">{{ item.profile?.email }}</p>
                <p class="text-xs font-semibold ml-1 leading-6 text-gray-500">
                  asked <time :datetime="(item.content as Posts).updated_at!">{{ dateTime((item.content as Posts).updated_at!) }}</time>
                </p>
                <NuxtLink 
                v-if="user && user.id === item.profile?.id" 
                :to="`/post/${item.id}/edit`" 
                class="text-blue-500 hidden group-hover:block text-xs text-[12px] mt-1.5 mx-2">
                Edit
                </NuxtLink>
                <a 
                v-if="user && user.id === item.profile?.id" 
                class="text-red-500 hidden group-hover:block text-xs mt-1.5 mr-2 cursor-pointer"
                >
                  Delete
                </a>
              </div>
              <h1 class="text-lg my-2 font-medium">{{ (item.content as Posts).title }}</h1>
              <p class="mb-2 text-base leading-5 ">
              {{ (item.content as Posts).content }}
              </p>
              <img 
                v-show="(item.content as Posts).image_url" 
                class="w-full h-80 object-cover mt-4 rounded-md"  
                :src="postImageUrls[(item.content as Posts).id]"
                alt="post image" 
                >
              <div class="flex">
                <div v-for="tag in (item.content as Posts).tags" :key="tag.id" class="mt-6 mr-2">
                  <Tag :id="tag.id" :text="tag.title!"  />
                </div>
              </div>
              <div class="flex gap-x-4 mt-4">
              <button class="flex">
                <span class="i-ri-chat-2-line text-xl text-slate-400" />
                <span class="text-sm">{{ (item.content as Posts).comments.length }} comments</span>
              </button>
              <button class="flex">
                <span class="i-ph-share-fat text-xl text-slate-400" />
                <span class="text-sm">share</span>
              </button>
              <BookmarkButton :post-id="item.id"/>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Comment Item -->
        <div v-else class="p-8">
          <div class="flex gap-x-2">
            <NuxtLink :to="`/profile/${(item.content as Comments).profiles?.username}`" class="">
              <UserAvatar :avatar-url="(item.content as Comments).profiles?.avatar_url || ''"/>
            </NuxtLink>
            <div class="min-w-0 flex-auto">
              <div class="flex">
                <NuxtLink 
                  :to="`/profile/${(item.content as Comments).profiles?.username}`" 
                  class="text-sm font-semibold leading-6"
                >
                  {{ (item.content as Comments).profiles?.username }}
                </NuxtLink>
                <p class="mt-1 text-xs font-semibold ml-1 text-gray-500">
                  added a comment <time>{{ dateTime((item.content as Comments).created_at!) }}</time>
                </p>
                <a 
                  v-if="user && user?.id === (item.content as Comments).profile_id" 
                  class="text-[red] cursor-pointer italic text-xs mt-1 ml-2 hidden group-hover:block"
                  @click="openWarningModal(item.id)" 
                >
                  Delete
                </a>
              </div>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="sanitizeHtml((item.content as Comments).content!)"/>
              <div class="flex items-center gap-4 mt-2">
                <VoteButton :target-id="item.id" target-type="comment" class="flex gap-1 items-center text-sm"/>
                <BookmarkButton :comment-id="item.id"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>