<template>
  <BaseLayout>
    <template #header>
      <ForumNavbar>
          <template #dynamic-content>
            <div class="flex items-center space-x-1.5 md:space-x-4">
              <button class="btn btn-outline border border-gray-300 dark:border-base-300" @click="() => setIsPreview(!isPreview)">
                <i class="h-4 w-4 md:mr-2" :class="isPreview ? 'i-lucide-eye-off' : 'i-lucide-eye'"/>
                <span class="hidden md:inline">{{ isPreview ? "Edit" : "Preview" }}</span>
              </button>
              <button class="bg-[#297D4E] rounded py-2 btn px-4 text-white  hover:bg-[#1f5a37]" @click="handleSubmit">
                <i class="h-4 w-4 md:mr-2" :class="loading ? `loading loading-spinner` : `i-lucide-send`"/>
                <span class="hidden md:inline">Post</span>
              </button>
            </div>
          </template>
      </ForumNavbar>
    </template>
    <template #main>
      <div class="px-4 py-6">
        <div class="max-w-4xl mx-auto">
          <div class="mb-6">
            <h1 class="text-2xl font-bold mb-2">Create a post</h1>
            <p class="text-muted-foreground">Share your research, ask questions, or start a discussion</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-8 ">
              <!-- Community Selection -->
              <DropdownSelector
                v-model="postData.selectedCommunity!"
                title="Choose a community"
                placeholder="Select a community"
                :items="communities!"
                icon-field="icon"
                label-field="name"
                meta-field="member_count"
                :format-meta="formatNumber"
              />

              <!-- Post Type Selection -->
              <div>
                <div class="p-0 card border border-gray-300 dark:border-base-300">
                  <Tab
                    :tabs="postTabs"
                    :shared-data="postData"
                    @update:shared-data="postData = $event"
                    @tab-change="handleTabChange"
                  >
                    <!-- Text tab content -->
                    <template #text="{ sharedData, updateShared }">
                      <TitleInput 
                        :value="sharedData.title"
                        @update="(value: string) => updateShared('title', value)"
                      />
                      
                      <div class="space-y-2">
                        <label class="label text-base-neutral" for="content">Text (optional)</label>
                        <textarea
                          id="content"
                          :value="sharedData.content"
                          rows="8"
                          placeholder="What are your thoughts?"
                          class="textarea resize-none block w-full"
                          @input="(e) => updateShared('content', (e.target as HTMLTextAreaElement)?.value)"
                        />
                      </div>
                      
                      <FlairSelector
                        :flairs="flairs!"
                        :selected="sharedData.selectedFlairs"
                        @update="(value: string) => updateShared('selectedFlairs', value)"
                      />
                    </template>

                    <!-- Image tab content -->
                    <template #image="{ sharedData, updateShared }">
                      <TitleInput 
                        :value="sharedData.title"
                        @update="(value: string) => updateShared('title', value)"
                      />
                      
                      <PostImageUpload
                        :image-preview="imagePreview"
                        @upload-image="handleImageUpload"
                        @trigger-image="triggerImageUpload"
                        @remove-image="removeImage"
                      />
                        
                        <!-- @upload="(value: string) => updateShared('imagePreview', value)" -->
                      <div class="space-y-2">
                        <label class="label text-base-neutral">Description (optional)</label>
                        <textarea
                          :value="sharedData.content"
                          class="textarea w-full block"
                          rows="4"
                          placeholder="Describe your image or add context"
                          @input="(e) => updateShared('content', (e.target as HTMLTextAreaElement)?.value)"
                        />
                      </div>
                      
                      <FlairSelector
                        :flairs="flairs!"
                        :selected="sharedData.selectedFlairs"
                        @update="(value: string) => updateShared('selectedFlairs', value)"
                      />
                    </template>

                    <!-- Link tab content -->
                    <template #link="{ sharedData, updateShared }">
                      <TitleInput 
                        :value="sharedData.title"
                        @update="(value: string) => updateShared('title', value)"
                      />
                      
                      <div class="space-y-2 mb-4">
                        <label class="label text-base-neutral">URL *</label>
                        <input
                          :value="sharedData.linkUrl"
                          class="block file-input w-full"
                          placeholder="https://example.com"
                          type="url"
                          @input="(e) => updateShared('linkUrl', (e.target as HTMLInputElement)?.value)"
                        >
                      </div>

                      <div class="space-y-2">
                        <label class="label text-md text-base-neutral">Description (optional)</label>
                        <textarea
                          :value="sharedData.content"
                          class="textarea block w-full"
                          placeholder="Add context or your thoughts about this link"
                          rows="4"
                          @input="(e) => updateShared('content', (e.target as HTMLTextAreaElement)?.value)"
                        />
                      </div>
                      
                      <FlairSelector
                        :flairs="flairs!"
                        :selected="sharedData.selectedFlairs"
                        @update="(value: string) => updateShared('selectedFlairs', value)"
                      />
                    </template>
                  </Tab>
              </div>
            </div>

            <!-- Preview -->
            <PostPreview
              :is-preview="isPreview"
              :image-preview="imagePreview!"
              :post-data="postData"
              :selected-community-data="selectedCommunityData!"
            />
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1 space-y-4">
            <!-- Posting Guidelines -->
            <div class="card border bg-base-100 border-gray-300 dark:border-base-300 px-4 py-8 shadow">
                <div class="text-lg flex items-center mb-4 font-medium">
                  <i class="h-5 w-5 mr-2 text-[#297D4E] i-lucide-info" />
                  Posting Guidelines
                </div>
              <div class="space-y-6 text-sm">
                <div class="flex items-start space-x-2">
                  <i class="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0 i-lucide-alert-circle" />
                  <p>Remember to follow community rules and Markins' content policy</p>
                </div>
                <div class="flex items-start space-x-2">
                  <i class="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0 i-lucide-alert-circle" />
                  <p>Use descriptive titles that clearly explain your post</p>
                </div>
                <div class="flex items-start space-x-2">
                  <i class="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0 i-lucide-alert-circle" />
                  <p>Cite sources for scientific claims and research</p>
                </div>
                <div class="flex items-start space-x-2">
                  <i class="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0 i-lucide-alert-circle" />
                  <p>Be respectful and constructive in your discussions</p>
                </div>
              </div>
            </div>

            <!-- Community Rules -->
            <div v-if="selectedCommunityData" class="card p-4 border border-gray-200 dark:border-base-300">
              <div>
                <div class="text-lg flex items-center mb-4 font-medium">
                  <span class="mr-2">{{ selectedCommunityData.icon }}</span>
                  {{ selectedCommunityData.name }} Rules
                </div>
              </div>
              <div>
                <div class="space-y-2">
                  <div v-for="(rule, index) in selectedCommunityData.rules" :key="index" class="flex items-start space-x-3">
                    <div class="flex-shrink-0 w-6 h-6 rounded-full bg-[#297D4E]/10 text-[#297D4E] text-xs font-medium flex items-center justify-center">
                      {{ index + 1 }}
                    </div>
                    <p class="text-sm text-muted-foreground">{{ rule }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import Tab from '~/components/ui/tab.vue';
import BaseLayout from '~/layouts/base.vue';
import { useToast } from 'vue-toastification';
import type { Database } from '~/types/database.types';
import type { Community, Flair } from '~/types/utility';
import TitleInput from '~/components/ui/title-input.vue';
import ForumNavbar from '~/components/header/forum-navbar.vue';
import PostPreview from '~/components/forum/post/post-preview.vue';
import DropdownSelector from '~/components/ui/dropdown-selector.vue';
import FlairSelector from '~/components/forum/flair/flair-selector.vue';
import PostImageUpload from '~/components/forum/post/post-image-upload.vue';

export interface PostData {
  title: string;
  content: string;
  linkUrl: string;
  selectedFlairs: Flair[];
  selectedImage: File | null;
  selectedCommunity: string | null;
  postType: 'text' | 'image' | 'link';
}

const toast = useToast();
const user = useSupabaseUser();
const { uploadImage } = useImageHandler();

// Reactive state
const loading = ref(false);
const isPreview = ref(false);
const imagePreview = ref<string | null>(null);
const postData = ref<PostData>({
  title: '',
  content: '',
  linkUrl: '',
  postType: 'text',
  selectedFlairs: [],
  selectedImage: null,
  selectedCommunity: null,
});


interface ApiResponse<T> {
  data: T;
  error?: string;
}

const { data: communities } = await useAsyncData(
  'communities', 
  async () => {
    try {
      const response = await $fetch<ApiResponse<Community[]>>(`/api/communities`);
      return response?.data || [];
    } catch {
      toast.error('An error occured while trying to fetch communities');
      return [];
    }
  }
);

const { data: flairs } = await useAsyncData(
  'flairs', 
  async () => {
    try {
      const response = await $fetch<ApiResponse<Flair[]>>(`/api/flairs`);
      return response?.data || [];
    } catch {
      toast.error('An error occured while trying to fetch flairs');
      return [];
    }
  }
);

// Computed
const selectedCommunityData = computed(() => 
  communities.value?.find((c) => c.id === postData.value.selectedCommunity)
)

// Methods
const formatNumber = (num: number) => {
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
}

const postTabs = [
  { id: 'text', label: 'Text', icon: 'i-lucide-file-text' },
  { id: 'image', label: 'Image', icon: 'i-lucide-image' },
  { id: 'link', label: 'Link', icon: 'i-lucide-link' }
];

const handleTabChange = (tabId: 'text' | 'image' | 'link') => {
  postData.value.postType = tabId
}

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    postData.value.selectedImage = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const triggerImageUpload = () => {
  document.getElementById('image-upload')?.click()
}

const removeImage = () => {
  postData.value.selectedImage = null
  imagePreview.value = ''
}

const setIsPreview = (value: boolean) => {
  isPreview.value = value
}

const supabase = useSupabaseClient<Database>();


const handleSubmit = async () => {
  try {
    loading.value = true;

    const { data: isMember } = await supabase
    .from('community_members')
    .select('*')
    .eq('user_id', user.value?.id ?? '')
    .eq('community_id', postData.value.selectedCommunity!)
    .single();

    if (!isMember) {
      throw new Error('You must join this community before posting');
    }


    // Create the post
    const res = await $fetch('/api/posts', {
      method: 'POST',
      body:({
        author_id: user.value?.id,
        post_type: postData.value.postType,
        community_id: postData.value.selectedCommunity,
        title: postData.value.title,
        content: postData.value.content,
        link_url: postData.value.linkUrl,
      }),
    });

    const post = res.post;

    // Step 2: Upload the image and generate the unique filename
    if (postData.value.selectedImage) {
      const imagePath = await uploadImage(postData.value.selectedImage, 'post-images', user.value?.id || '')

      // Step 3: Update the post with the new image URL
      await $fetch(`/api/posts/${post.id}`, {
        method: 'PATCH',
        body: {
          image_url: imagePath,
        },
      });
    }

    // Add tags to the post
    await $fetch('/api/post_flairs', {
      method: 'POST',
      body: postData.value.selectedFlairs.map((flair) => ({
        post_id: post.id,
        flair_id: flair.id,
      })),
    });

    toast.success('Post successfully created!');
    navigateTo(`${post.id}`);
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('An unexpected error occurred.');
    }
  } finally {
    loading.value = false;
  }
};
</script>