<template>
  <ForumLayout>
    <template #main>
      <div class="relative mt-4 mb-6">
        <form class="w-full p-8 max-w-2xl" @submit.prevent="handleForm">
          <div>
            <label for="title" class="label-text font-black mb-3 capitalize">title</label>
            <input 
            id="title" 
            v-model="newPost.title" 
            type="text" 
            class="w-full border border-gray-300 bg-base-100 outline-none p-1 " 
            required
            >
            <ClientOnly>
              <label for="editor" class="label-text font-black capitalize mt-8 block mb-2">body</label>
              <Editor 
              id="editor"
              :image="newPost.image_url!" 
              :payload="newPost.content!"
              :allow-image-upload="true"
              @post-content="postContent"
              @update-image="updateImages"/>
            </ClientOnly>
            <div class="bg-base-100">
              <label for="tags" class="font-bold label-text mb-2 block mt-10">Tags</label>
              <Multiselect
                id="tags"
                v-model="selectedTags"
                class="bg-base-100"
                mode="tags"
                :close-on-select="false"
                :options="tags" 
                :resolve-on-load="false"
                :delay="0"
                :searchable="true"
                :max=5
                @deselect="deselectTag"
              />
            </div>
            <button 
            type="submit" 
            :disabled="loading" 
            class="bg-[seagreen] px-9 py-2 uppercase text-white mt-4 flex gap-x-2 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
            <span v-if="loading" class="loading loading-spinner text-white"/>
              <span>submit</span>
            </button>
          </div>
        </form>
      </div>
    </template>
    <template #aside>
      <div class="pt-16 pr-8">
        <div class="bg-base-300 rounded">
          <Accordion :content="rules"/>
        </div>
      </div>
    </template>
  </ForumLayout>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification';
import ForumLayout from '~/layouts/forum.vue';
import Multiselect from '@vueform/multiselect';
import "@vueform/multiselect/themes/default.css";
import type { Tables } from '~/types/database.types';
import type { NestedResponse } from '~/types/utility';

interface TagResponse {
  data: Tables<'tags'>[];
}

type Posts = NestedResponse<
  Tables<'posts'> & { tags: Tables<'tags'>[]; },
  'id'
>;

const post = ref();
const tags = ref();
const toast = useToast();
const loading = ref(false);
const user = useSupabaseUser();
const config = useRuntimeConfig();
const client = useSupabaseClient();
const selectedTags = ref<string[]>([]);
const selectedFile = ref<Blob | null>(null);

const rules = [
  {
    id: "1",
    title: '1. Be Clear and Concise',
    contents: [
			{ 
				name :'Write your question in a way that is easy to understand. Include relevant details, but avoid unnecessary information that might confuse others.',
				image: undefined,
				link: undefined
			}
		],
    open: true
  },
  {
    id: "2",
    title: '2. Stay on Topic',
    contents: [{ 
			name: "Ensure your question is related to science, research, or the community’s focus areas. Off-topic questions may be removed.",
			image: undefined,
			link: undefined
		}],
    open: false
  },
  {
    id: "3",
    title: '3. Avoid Homework Questions',
    contents: [{ 
			name: "Do not post homework or assignment questions expecting direct answers. Instead, ask for guidance or clarification about concepts you don’t understand.",
			image: undefined,
			link: undefined
		}],
    open: false
  },
  {
    id: "4",
    title: '4. Avoid Duplicate Questions',
    contents: [{ 
			name: "Before posting, search the community to ensure your question hasn’t already been asked. If it has, add your thoughts or seek clarification in the existing thread.",
			image: undefined,
			link: undefined
		}],
    open: false
  },
]


const newPost = reactive<Partial<Posts>>({
  content: '',
  tags: [],
  title: '',
  profile_id: '',
  image_url: null,
  id: '',
  community_id: null,
  created_at: null,
  updated_at: null
})

const { data: response } = await useFetch<TagResponse>('/api/tags', {
  method: 'GET',
})

tags.value = response.value?.data.map((item: Tables<'tags'>) => {
  return item.title;
})

const updateImages = async (file: Blob) => {
  selectedFile.value = file
}

function generateUniqueFilename(filename: string, postId: string) {
  const timestamp = Date.now();
  return `${postId}/${timestamp}-${filename}`;
}

async function uploadImage(file: Blob, path: string) {
  const { data, error } = await client.storage.from('images').upload(path, file, { cacheControl: '3600', upsert: true });
  if(error) toast.error(error.message);
  return config.public.apiUrl + '/storage/v1/object/public/images/' + data?.path;
}

const deselectTag = (e: { originalEvent: Event; value: string; }) => {
  selectedTags.value.splice(selectedTags.value.indexOf(e.value), 1);
}

 const formatedTitle = computed(() => {
  return newPost.title?.replace(/\s+/g, '-')
 })

const postContent = (payload: string) => {
  newPost.content = payload
}

const handleForm = async () => {
  try {
    loading.value = true

      // Map selected tag titles to tag IDs
    const selectedTagIds = response.value?.data
    .filter(tag => selectedTags.value.includes(tag.title!))
    .map(tag => tag.id) || [];

    const res = await $fetch(`/api/posts`, {
      method: "POST",
      body: {
        title: newPost.title,
        content: newPost.content,
        profile_id: user.value?.id,
        image_url: newPost.image_url,
      }
    })

    post.value = res.post;

    // Step 2: Upload the image and generate the unique filename
    if (selectedFile.value) {
      const filePath = generateUniqueFilename(selectedFile.value.name, post.value.id);
      const imageUrl = await uploadImage(selectedFile.value, filePath);

      // Step 3: Update the post with the new image URL
      await $fetch(`/api/posts/${post.value.id}`, {
        method: 'PATCH',
        body: {
          image_url: imageUrl,
        },
      });

      // Update the local state with the new image URL
      newPost.image_url = imageUrl;
    }
    
    await $fetch('/api/post_tags', {
      method: 'POST',
      body: (selectedTagIds?.map((tagId) => {
        return {
          post_id: post.value.id,
          tag_id: tagId
        }
      })),
    })
    
    toast.success('Post successfully created!');
    navigateTo(`${post.value?.id}/${formatedTitle.value}`)
  } catch (error) {
    if(error instanceof Error){
      toast.error(error.message)
      return;
    } 
  }finally{
    loading.value = false
  } 
}

</script>

<style>
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