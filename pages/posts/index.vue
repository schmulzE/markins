<template>
  <ForumLayout>
    <template #main>
      <div class="mt-8">
        <InfiniteScroll
        table-name="posts"
        :columns="['*', 'profiles!posts_profile_id_fkey(*)', 'comments(id, content, profile_id, post_id)', 'post_tags(*)', 'tags(*)']"
        :items-per-page="10"
        :order-by="{ column: 'created_at', ascending: true }"
        />
      </div>
    </template>
    <template #aside>
      <RecentPosts/>
    </template>
  </ForumLayout>
</template>

<script setup lang="ts"> 
import ForumLayout from "~/layouts/forum.vue";
import InfiniteScroll from '~/components/ui/infinite-scroll.vue';
import RecentPosts from "~/components/forum/post/recent-posts.vue";

definePageMeta({
  middleware: 'auth', // Apply the auth middleware
});

</script>