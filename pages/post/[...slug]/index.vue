<template>
  <ForumLayout>
    <template #main>
      <div class="mb-8 relative">
        <Post 
        :post="post!"
        :user="user!"
        :comments="comments"
        :image_url="image_url"
        :votes="totalPostVotes"
        @delete-post="deletePost"
        />
        <div class="bg-base-100">
          <div class="my-5 mx-8 py-6">
            <ClientOnly>
              <Editor
              :loading="loading"
              :allow-image-upload="false"
              @create-comment="createComment" 
              />
            </ClientOnly>
          </div>
          <CommentList 
          :loading="commentLoading"
          :post-id="postId" 
          :comments="comments"
          @delete-comment="deleteComment"
          />
        </div>
      </div>
    </template>
    <template #aside>
      <RecentPosts />
    </template>
  </ForumLayout>
</template>

<script setup lang="ts">
import {useToast} from 'vue-toastification';
import ForumLayout from '~/layouts/forum.vue';
import Post from '~/components/forum/post/post.vue';
import type { Posts, Comments } from '~/types/utility';
import useModalStore from '../../../stores/useModalStore';
import RecentPosts from '~/components/forum/post/recent-posts.vue';
import CommentList from '~/components/forum/comment/comment-list.vue';


interface PostResponse {
  data: Posts;
}


const route = useRoute();
const post= ref<Posts>();
const toast = useToast();
const image_url = ref('');
const loading  = ref(false);
const store = useModalStore();
const user = useSupabaseUser();
const commentLoading = ref(false)
const postId = route.params.slug[0];
const comments = ref<Comments[]>([]);
const totalPostVotes = ref<number>(0);

//fetch post
const { data: { value: payload  }, error: payloadError } = await useAsyncData<PostResponse>('post', async () => $fetch(`/api/posts/${postId}`));
if(payloadError == undefined) toast.error('An error occured while trying to fetch post');
post.value = payload!.data;

//fetch comment from api
const { data: { value: postResponse }, error } = await useAsyncData ('comments', async () => $fetch(`/api/comments/${postId}`));
if(error == undefined) toast.error('An error occured while trying to fetch comments');
comments.value = postResponse!.data as Comments[];

const deleteComment = async (id: string) => {
  try {
    commentLoading.value = true
    await $fetch(`/api/comments/${id}`, {
      method: "DELETE"
    })
    
    const commentIndex = comments.value.findIndex((comment: { id: string; }) => comment.id == id)
    comments.value.splice(commentIndex, 1)
  } catch (error) {
    if(error instanceof Error) {
      throw new Error(error.message);
    }
  }finally {
    commentLoading.value = false;
    store.closeModal();
  }
}

const createComment = async(payload: string) => {
  try {
    loading.value = true;
    
    const {data}  = await $fetch(`/api/comments/${postId}`, {
      method: 'POST',
      body: {
        message: payload,
        profile_id: user.value!.id,
        post_id: postId
      },
    })
    comments.value.unshift(data as Comments)
    
  } catch (error) {
    if(error instanceof Error) {
      throw new Error(error.message);
    }
  } finally {
    loading.value = false;
  }
}


const deletePost = async (imagePath: string) => {
  try {
   await $fetch(`/api/posts/${postId}`, {
    method: "DELETE" as never,
    body: imagePath
   })

  } catch (error) {
    if(error instanceof Error) {
      throw new Error(error.message);
    }
  }finally {
    navigateTo('/posts', {replace: true})
  }

}

</script>
