<template>
  <BaseLayout>
    <template #header>
      <ForumNavbar>
        <div class="flex items-center space-x-4">
          <button class="btn btn-outline border border-gray-300" @click="() => setIsPreview(!isPreview)">
            <i class="h-4 w-4 mr-2 i-lucide-eye" />
            {{ isPreview ? "Edit" : "Preview" }}
          </button>
          <button class="bg-[#297D4E] rounded py-2 btn px-4 text-white  hover:bg-[#1f5a37]" @click="handleSubmit">
            <i class="h-4 w-4 mr-2" :class="loading ? `loading loading-spinner` : `i-lucide-send`"/>
            Post
          </button>
        </div>
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
              <div class="card bg-base-100 p-4 border border-gray-300 space-y-4">
                <div>
                  <div class="text-lg">Choose a community</div>
                </div>
                <DropdownSelector
                  v-model="postData.selectedCommunity"
                  title="Choose a community"
                  placeholder="Select a community"
                  :items="communities!"
                  icon-field="icon"
                  label-field="name"
                  meta-field="member_count"
                  :format-meta="formatNumber"
                />
              </div>

              <!-- Post Type Selection -->
              <div>
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
            <div class="card border bg-base-100 border-gray-300 px-4 py-8 shadow">
                <div class="text-lg flex items-center mb-4 font-medium">
                  <i class="h-5 w-5 mr-2 text-[#297D4E] i-lucide-info" />
                  Posting Guidelines
                </div>
              <div class="space-y-6 text-sm">
                <div class="flex items-start space-x-2">
                  <i class="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0 i-lucide-alert-circle" />
                  <p>Remember to follow community rules and Reddit's content policy</p>
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
            <div v-if="selectedCommunityData" class="card p-4 border border-gray-200">
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
import BaseLayout from '~/layouts/base.vue';
import { useToast } from 'vue-toastification';
import TitleInput from '~/components/ui/title-input.vue';
import type { Community, Flair, Post } from '~/types/utility';
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
  selectedCommunity: string;
  selectedImage: File | null;
  postType: 'text' | 'image' | 'link';
}

interface ApiResponse<T> {
  data: T;
  error?: string;
}

const route = useRoute();
const toast = useToast();
const user = useSupabaseUser();
const { uploadImage } = useImageHandler();


// Reactive state
const loading = ref(false);
const imagePreview = ref('');
const isPreview = ref(false);
const postId = route.params.id as string;
const postData = ref<PostData>({
  title: '',
  content: '',
  linkUrl: '',
  postType: 'text',
  selectedFlairs: [],
  selectedImage: null,
  selectedCommunity: '',
});

const postTabs = [
  { id: 'text', label: 'Text', icon: 'i-lucide-file-text' },
  { id: 'image', label: 'Image', icon: 'i-lucide-image' },
  { id: 'link', label: 'Link', icon: 'i-lucide-link' }
];

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

const { data: post } = await useAsyncData(
  'post', 
  async () => {
    try {
      const response = await $fetch<ApiResponse<Post>>(`/api/posts/${postId}`);
      return response?.data;
    } catch {
      toast.error('An error occured while trying to fetch communities');
      return {};
    }
  }
);

onMounted(() => {
  // Set initial values from post data if available
  if (post.value) {
    postData.value.title = post.value.title || '';
    postData.value.content = post.value.content || '';
    postData.value.linkUrl = post.value.link_url || '';
    postData.value.selectedCommunity = post.value.community_id || '';
    postData.value.postType = (post.value.post_type as 'text' | 'image' | 'link') || 'text';
    
    // Load image preview if available
    if (post.value.image_url) {
      imagePreview.value = post.value.image_url;
    }

    // Load selected flairs
    postData.value.selectedFlairs = (post.value.post_flairs as unknown as Flair[]) || [];
  }
});

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

const handleTabChange = (tabId: 'text' | 'image' | 'link') => {
  postData.value.postType = tabId
}

const setIsPreview = (value: boolean) => {
  isPreview.value = value
}

const handleSubmit = async () => {
  try {
    loading.value = true;

    // Create the post
    const res = await $fetch('/api/posts', {
      method: 'POST',
      body:({
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

    toast.success('Post submitted successfully!');
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