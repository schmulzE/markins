<template>
  <BaseLayout>
    <template #header>
      <ForumNavbar>
        <template #dynamic-content>
          <nav class="flex items-center space-x-4">
            <NuxtLink to="/posts" class="hidden md:flex text-sm font-medium hover:text-[#297D4E] transition-colors">
              Posts
            </NuxtLink>
            <NuxtLink to="/communities" class="text-sm font-medium hover:text-[#297D4E] transition-colors">
              Communities
            </NuxtLink>
          </nav>
        </template>
      </ForumNavbar>
    </template>
    <template #main>
      <div class="px-4 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- User Info Sidebar -->
          <ProfileSidebar :user="user!" @open-chat-modal="openChatModal"/>

          <!-- Main Content -->
          <div class="lg:col-span-2 card">
            <Tab
              :tabs="tabs"
              default-tab="posts"
              radio-group-name="user_tabs"
              tab-button-class="px-4 md:px-24"
              tab-content-class="p-0"
            >
  >           <template #posts="">
                <UserPostList :posts="posts" />
              </template>

              <template #comments="">
                <UserCommentList :comments="comments" />
              </template>

              <template #saved="">
                <BookmarkedPosts :bookmarked-posts="bookmarkedPosts" />
              </template>
            </Tab>
          </div>
        </div>
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import Tab from '~/components/ui/tab.vue';
import BaseLayout from '~/layouts/base.vue';
import { useToast } from 'vue-toastification';
import type { Profile } from '~/types/utility';
import useModalStore from '~/stores/useModalStore';
import relativeTime from 'dayjs/plugin/relativeTime';
import ForumNavbar from '~/components/header/forum-navbar.vue';
import UserPostList from '~/components/forum/user/user-post-list.vue';
import ProfileSidebar from '~/components/forum/user/profile-sidebar.vue';
import BookmarkedPosts from '~/components/forum/post/bookmarked-posts.vue';
import UserCommentList from '~/components/forum/user/user-comment-list.vue';

dayjs.extend(relativeTime)

export interface BookmarkedPost {
  id: string;
  title: string;
  postId: string;
  content: string | null;
  community: string;
  communitySlug: string;
  communityIcon: string | null;
  timeAgo: string;
  upvotes: number;
  comments: number;
  type: string;
  imageUrl: string;
  linkUrl: string | undefined;
}

const toast = useToast();
const route = useRoute();
const store = useModalStore();

const user = ref<Profile | null>(null);
const username = route.params.username as string;
const isLoading = ref(false);

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
    communitySlug: post.community.slug,
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
    postId: comment.post.id,
    community: comment.post.community.name,
    timeAgo:  dayjs(comment.created_at).fromNow(),
    upvotes: comment.upvotes ?? 0
  })) ?? [];
});

const bookmarkedPosts = computed(() => {
  return user.value?.bookmarks?.filter(b => !b.comment_id).map(bookmark => ({
    id: bookmark.id,
    title: bookmark.post.title,
    postId: bookmark.post_id ?? '', // Ensure postId is always a string
    content: bookmark.post.content,
    community: bookmark.post.community.name,
    communitySlug: bookmark.post.community.slug,
    communityIcon: bookmark.post.community.icon,
    timeAgo: dayjs(bookmark.created_at).fromNow(),
    upvotes: bookmark.post.upvotes ?? 0,
    comments: bookmark.post.comment_count ?? 0,
    type: bookmark.post.post_type,
    imageUrl: bookmark.post.image_url || "/svg/placeholder.svg?height=200&width=300",
    linkUrl: bookmark.post.link_url || undefined
  })) ?? [];
});

async function openChatModal() {
  isLoading.value = true;
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
      },
      isLoading: isLoading.value,
      messages: []
    }
  });

  try {
    const response = await $fetch(`/api/messages/${user.value?.id}`);
    store.updateModalProps({
      messages: response?.data,
    });
  } catch {
    toast.error('An error occurred while fetching messages');
    store.closeModal();
  } finally {
    isLoading.value = false;
    store.updateModalProps({
      isLoading: false,
    });
  }
}

const tabs = [
  { id: 'posts', label: 'Posts', icon: 'i-lucide-file-text' },
  { id: 'comments', label: 'Comments', icon: 'i-lucide-message-square' },
  { id: 'saved', label: 'Saved', icon: 'i-lucide-bookmark' }
]
</script>