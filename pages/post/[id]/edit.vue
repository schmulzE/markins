<template>
  <ForumLayout>
    <template #main>
      <div class="flex flex-col justify-center items-center">
        <form class=" w-full p-12 bg-base-100 white max-w-4xl" @submit.prevent="handleForm">
          <label for="title" class="label-text font-black mb-3 capitalize">title</label>
          <input 
          v-if="singlePost.title" 
          id="title" 
          v-model="singlePost.title" 
          type="text" 
          class="w-full border border-gray-300 outline-none p-1 bg-base-100" 
          required
          >
          <label for="content" class="label-text font-black capitalize mt-8 block mb-2">body</label>
          <Editor
          id="content" 
          :image="singlePost.image_url!" 
          :payload="singlePost.content!" 
          @custom-change="updateChange" 
          @update-image="updateImages"/>
        <div>
          <label class="font-bold label-text mb-2 block mt-10" for="tags">Tags</label>
          <Multiselect
            v-model="selectedTags"
            :options="tags"
            mode="tags"
            multiple
            track-by="value"
            @deselect="deselectTag"
            />
        </div>
        <button type="submit" class="bg-[seagreen] px-9 py-2 uppercase text-white mt-4">
          <span v-if="!loading">submit</span>
          <span v-else class="loading loading-spinner text-white inline-block mx-14"/>
        </button>
      </form>
    </div>
    </template>
    <template #aside>
      <RecentPosts />
    </template>
  </ForumLayout>
</template>

<script setup lang="ts">
import type { Posts } from '~/types/utility';
import ForumLayout from '~/layouts/forum.vue';
import { useToast } from 'vue-toastification';
import Multiselect from '@vueform/multiselect';
import "@vueform/multiselect/themes/default.css";
import RecentPosts from '~/components/forum/post/recent-posts.vue';

const route = useRoute()
const toast = useToast();
const loading = ref(false)
const updatedPostTag = ref()
const postId = route.params.id;
const config = useRuntimeConfig()
const client = useSupabaseClient()
const selectedTags = ref<string[]>([])
const tags = ref<(string | null)[] | undefined>([])

const { data: response  } = await useAsyncData('tag', async () => $fetch('/api/tags', {
  method: 'GET',
}))

tags.value = response.value?.data.map((item: { id: string; title: string | null; }) => {
  return item.title;
})


let singlePost = reactive<Partial<Posts>>({
  title: '',
  content: '',
  tags: [],
  image_url: '',
})

const {  data, error, } = await useAsyncData('post', () =>  $fetch(`/api/posts/${route.params.id}`))
if(error instanceof Error) toast.error(error.message);
if (data.value && 'data' in data.value) {
  singlePost = data.value.data as Posts;
}

onUpdated(() => {
  updatedPostTag.value = response.value?.data.filter((item) => selectedTags.value.includes(item.title!))
})

const deselectTag = (e: { originalEvent: Event; value: string; }) => {
  const index = selectedTags.value.indexOf(e.value);
  if (index !== -1) {
    selectedTags.value.splice(index, 1);
  }
};

const updateImages = async (file: Blob) => {
  const previousImage = singlePost.image_url as string
  const path = extractFilename(previousImage)
  const url = await uploadImage(file, path)
  singlePost.image_url = url
}

function extractFilename(url: string) {
  return url.match(/\/([^/]+)$/)![1];
}

async function uploadImage(file: Blob, path: string) {
  const { data, error } = await client.storage.from('images').update(path, file, { cacheControl: '3600', upsert: true });
  if(error) toast.error('Failed to upload image');
  return config.public.apiUrl + '/storage/v1/object/public/images/' + data?.path;
}


onMounted( async() => {
  const postTags = singlePost.tags?.map((item) => {
    return item.title
  })
  if(postTags) {
    selectedTags.value = postTags?.filter((tag) => tag !== null)
  }
})

const formatedTitle = computed(() => {
  return singlePost.title!.replace(/\s+/g, '-')
})

const updateChange = ( payload: string) => {
  singlePost.content = payload
}

const handleForm = async () => {
  try {
    loading.value = true
    await $fetch(`/api/posts/${postId}`, {
      method: "PATCH" as never,
      body: singlePost ,
    })

    await $fetch(`/api/post_tags/${postId}`, {
      method: "DELETE",
    })

    // Add new post tags
    const selectedTagIds = response.value?.data
    .filter(tag => selectedTags.value.includes(tag.title!))
    .map(tag => tag.id) || [];

    await $fetch(`/api/post_tags/${postId}`, {
      method: 'PATCH',
      body: ( selectedTagIds.map((tagId) => {
        return {
          post_id: postId,
          tag_id: tagId
        }
      })),
    })

    
    toast.success('Post successfully updated!');
    navigateTo(`/post/${postId}/${formatedTitle.value}`)
  } catch (error) {
    if(error instanceof Error){
     toast.error(error.message);
     return;
    } 
  }finally{
    loading.value = false
  }
  
}

</script>

<style scoped>
[data-theme="dark"] .multiselect {
  background-color: inherit;
}

[data-theme="dark"] .multiselect-tags-search {
  background-color: inherit;
}
[data-theme="dark"] .multiselect-dropdown, .multiselect-options, .multiselect-option is-pointed {
  background: inherit;
}
</style>