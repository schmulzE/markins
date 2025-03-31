<script lang="ts" setup>
import type { Posts } from '~/types/utility';
import { useToast } from 'vue-toastification';
import ForumLayout from '~/layouts/forum.vue';
import PostList from '~/components/forum/post/post-list.vue';
import RecentPosts from '~/components/forum/post/recent-posts.vue';

const route = useRoute();
const toast = useToast();

const { data, error } = useAsyncData('tags', () => $fetch(`/api/tags/${route.params.id}`));
if(error.value == undefined) toast.error(`An error occured while fetching the tags`);
const posts =  data.value?.data.flatMap(tag => tag.posts) as unknown as Posts[];

</script>
<template>
  <ForumLayout>
    <template #main>
      <div class="mt-8">
        <PostList :posts="posts" />
      </div>
    </template>
    <template #aside>
      <RecentPosts />
    </template>
  </ForumLayout>
</template>
