<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div class="flex h-16 items-center justify-between px-4">
        <NuxtLink to="/posts" class="flex items-center space-x-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#297D4E]">
            <i class="h-5 w-5 text-white" />
          </div>
          <span class="text-xl font-bold text-[#297D4E]">ScienceForum</span>
        </NuxtLink>

        <div class="flex items-center space-x-4">
          <button class="btn btn-outline border border-gray-300" @click="() => setIsPreview(!isPreview)">
            <i class="h-4 w-4 mr-2 i-lucide-eye" />
            {{ isPreview ? "Edit" : "Preview" }}
          </button>
          <button class="bg-[#297D4E] rounded py-2 btn px-4 text-white  hover:bg-[#1f5a37]" @click="handleSubmit">
            <i class="h-4 w-4 mr-2 i-lucide-send" />
            Post
          </button>
        </div>
      </div>
    </header>

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
              <div>
                <select v-model="selectedCommunity" class="select w-full" >
                  <option disabled value="">Select a community</option>
                  <option
                    v-for="community in communities"
                    :key="community.id"
                    :value="community.id"
                    class="flex items-center text-gray-5000 space-x-2 p-4"
                  >                   
                      {{ community?.icon }}
                      {{ community.name }}
                    ({{ community?.member_count }})
                  </option>
                </select>
              </div>
            </div>

            <!-- Post Type Selection -->
            <div>
              <div class="p-0 card border border-gray-300">
              <!-- name of each tab group should be unique -->
              <div class="tabs tabs-box gap-2">
                <label
                  class="tab flex items-center justify-center gap-2 cursor-pointer px-16"
                >
                  <input
                    type="radio"
                    class="hidden"
                    name="my_tabs_6"
                    checked="true"
                    @change="() => setPostType('text')"
                  >
                  <i class="w-4 h-4 i-lucide-file-text" />
                  <span>Text</span>
                </label>

                <div class="tab-content bg-base-100 border-base-300 p-6">
                  <div class="space-y-2 mb-6">
                    <label class="label text-black" for="title">Title *</label>
                    <input
                      id="title"
                      placeholder="An interesting title for your post"
                      :value="title"
                      class="input input-lg text-lg bock w-full"
                      @input="(e: Event) => setTitle((e.target as HTMLInputElement).value)"
                    >
                    <p class="text-sm text-muted-foreground">{{ title.length }}/300 characters</p>
                  </div>
                  
                  <div class="space-y-2">
                    <label class="label text-black" for="content">Text (optional)</label>
                    <textarea
                      id="content"
                      placeholder="What are your thoughts?"
                      rows="8"
                      :value="content"
                      class="textarea resize-none block w-full"
                      @input="(e: Event) => setContent((e.target as HTMLTextAreaElement).value)"
                    />
                  </div>
                  
                  <div class="space-y-2 mt-6">
                    <label class="flex items-center space-x-2">
                      <i class="h-4 w-4 i-lucide-hash" />
                      <span>Flairs (optional)</span>
                    </label>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="flair in flairs"
                        :key="flair.id"
                        class="badge"
                        :class="`cursor-pointer transition-colors ${
                          selectedFlairs.includes(flair)
                            ? 'bg-[#297D4E] hover:bg-[#1f5a37]'
                            : 'hover:bg-[#297D4E]/10 badge-outline'
                        }`"
                        @click="() => toggleFlair(flair)"
                      >
                        {{ flair.name }}
                    </button>
                    </div>
                  </div>
                </div>

                <label
                  class="tab flex items-center justify-center gap-2 cursor-pointer px-16"
                >
                  <input
                    type="radio"
                    class="hidden"
                    name="my_tabs_6"
                    @change="() => setPostType('image')"
                  >
                  <i class="w-4 h-4 i-lucide-image" />
                  <span>Image</span>
                </label>
                <div class="tab-content bg-base-100 border-base-300 p-6">
                  <div class="space-y-2 mb-6">
                    <label class="label text-black" for="title">Title *</label>
                    <input
                      id="title"
                      placeholder="An interesting title for your post"
                      :value="title"
                      class="input input-lg text-lg bock w-full"
                      @input="(e: Event) => setTitle((e.target as HTMLInputElement).value)"
                    >
                    <p class="text-sm text-muted-foreground">{{ title.length }}/300 characters</p>
                  </div>
                  
                  <div class="space-y-2 mb-4">
                    <label class="label text-black">Upload Image</label>
                    <div v-if="!imagePreview" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <i class="i-lucide-upload h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p class="text-muted-foreground mb-4">Drag and drop an image, or click to browse</p>
                      <input
                      id="image-upload"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="handleImageUpload"
                      >
                      <button
                        class="btn btn-outline"
                        @click="triggerImageUpload"
                      >
                        Choose File
                      </button>
                    </div>
                    <div v-else class="relative">
                      <div class="relative w-full h-64 rounded-lg overflow-hidden">
                        <img
                          :src="imagePreview || '/svg/placeholder.svg'"
                          alt="Preview"
                          class="object-cover w-full h-full"
                        >
                      </div>
                      <button
                        class="absolute top-2 right-2 btn btn-sm btn-error"
                        @click="removeImage"
                      >
                        <i class="h-4 w-4 i-lucide-x" />
                      </button>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="label text-black" for="image-content">Description (optional)</label>
                    <textarea
                    id="image-content"
                    class="textarea w-full block"
                      placeholder="Describe your image or add context"
                      :value="content"
                      rows="4"
                      @input="(e: Event) => setContent((e.target as HTMLTextAreaElement).value)"
                    />
                  </div>
                  
                  <div class="space-y-2 mt-6">
                    <label class="flex items-center space-x-2">
                      <i class="h-4 w-4 i-lucide-hash" />
                      <span>Flairs (optional)</span>
                    </label>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="flair in flairs"
                        :key="flair.id"
                        class="badge"
                        :class="`cursor-pointer transition-colors ${
                          selectedFlairs.includes(flair)
                            ? 'bg-[#297D4E] hover:bg-[#1f5a37]'
                            : 'hover:bg-[#297D4E]/10 bagdge-outline'
                        }`"
                        @click="() => toggleFlair(flair)"
                      >
                        {{ flair.name }}
                    </button>
                    </div>
                  </div>
                </div>

                  <label
                  class="tab flex items-center justify-center gap-2 cursor-pointer px-16"
                  >
                    <input
                      type="radio"
                      class="hidden"
                      name="my_tabs_6"
                      @change="() => setPostType('link')"
                    >
                    <i class="w-4 h-4 i-lucide-link" />
                    <span>Link</span>
                  </label>
                <div class="tab-content bg-base-100 border-base-300 p-6 space-y-2">
                  <div class="space-y-2 mb-6">
                    <label class="label text-black" for="title">Title *</label>
                    <input
                      id="title"
                      placeholder="An interesting title for your post"
                      :value="title"
                      class="input input-lg text-lg bock w-full"
                      @input="(e: Event) => setTitle((e.target as HTMLInputElement).value)"
                    >
                    <p class="text-sm text-muted-foreground">{{ title.length }}/300 characters</p>
                  </div>
                  
                  <div class="space-y-2 mb-4">
                    <label for="url">URL *</label>
                    <input
                      id="url"
                      class="block file-input w-full"
                      placeholder="https://example.com"
                      :value="linkUrl"
                      type="url"
                      @input="(e: Event) => setLinkUrl((e.target as HTMLInputElement).value)"
                    >
                  </div>

                  <div class="space-y-2">
                    <label class="label text-md text-black" for="link-content">Description (optional)</label>
                    <textarea
                      id="link-content"
                      class="textarea block w-full"
                      placeholder="Add context or your thoughts about this link"
                      :value="content"
                      rows="4"
                      @input="(e) => setContent((e.target as HTMLTextAreaElement).value)"
                    />
                  </div>
                  
                  <div class="space-y-2 mt-6">
                    <label class="flex items-center space-x-2">
                      <i class="h-4 w-4 i-lucide-hash" />
                      <span>Flairs (optional)</span>
                    </label>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="flair in flairs"
                        :key="flair.id"
                        class="badge"
                        :class="`cursor-pointer transition-colors ${
                          selectedFlairs.includes(flair)
                            ? 'bg-[#297D4E] hover:bg-[#1f5a37]'
                            : 'hover:bg-[#297D4E]/10'
                        }`"
                        @click="() => toggleFlair(flair)"
                      >
                        {{ flair.name }}
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <!-- Preview -->
          <div v-if="isPreview" class="card border bg-base-100 border-gray-200 p-4">
            <div>
              <div class="text-lg">Preview</div>
            </div>
            <div>
              <div class="space-y-4">
                <div class="flex items-center space-x-2">
                  <template v-if="selectedCommunityData">
                    <span>{{ selectedCommunityData.icon }}</span>
                    <span class="text-sm font-medium text-[#297D4E]">{{ selectedCommunityData.name }}</span>
                    <span class="text-xs text-muted-foreground">• Posted by u/you • now</span>
                  </template>
                </div>

                <div v-if="selectedFlairs.length > 0" class="flex flex-wrap gap-1">
                  <div
                    v-for="flair in selectedFlairs"
                    :key="flair.id"
                    class="bg-[#297D4E]/10 text-[#297D4E] badge"
                  >
                    {{ flair.name }}
                </div>
                </div>

                <h3 class="text-lg font-semibold">{{ title || "Your post title will appear here" }}</h3>

                <div v-if="postType === 'image' && imagePreview" class="relative w-full h-64 rounded-lg overflow-hidden">
                  <img :src="imagePreview || '/svg/placeholder.svg'" alt="Preview" class="object-cover w-full h-full" >
                </div>

                <div v-if="postType === 'link' && linkUrl" class="border border-gray-300 rounded-lg p-3 bg-gray-50">
                  <div class="flex items-center space-x-2 text-sm text-[#297D4E]">
                    <i class="h-4 w-4 i-lucide-link" />
                    <span class="truncate">{{ linkUrl }}</span>
                  </div>
                </div>

                <p v-if="content" class="text-sm text-gray-700 whitespace-pre-wrap">{{ content }}</p>
              </div>
            </div>
          </div>
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
</div>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification'
import type { Community, Flair } from '~/types/utility';

const toast = useToast();

// Reactive state
const title = ref('');
const content = ref('');
const linkUrl = ref('');
const loading = ref(false);
const imagePreview = ref('');
const isPreview = ref(false);
const config = useRuntimeConfig();
const selectedCommunity = ref('');
const selectedFlairs = ref<Flair[]>([]);
const selectedImage = ref<File | null>(null);
const postType = ref<'text' | 'image' | 'link'>('text');

const client = useSupabaseClient();

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


// const flairs = ['Research', 'Discussion', 'Question', 'News', 'Theory', 'Experiment', 'Review', 'Meta']

// Computed
const selectedCommunityData = computed(() => 
  communities.value?.find((c) => c.id === selectedCommunity.value)
)

// Methods
const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    selectedImage.value = file
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
  selectedImage.value = null
  imagePreview.value = ''
}

const toggleFlair = (flair: Flair) => {
  const index = selectedFlairs.value.findIndex(f => f.id === flair.id);
  if (index !== -1) {
    selectedFlairs.value.splice(index, 1);
  } else {
    selectedFlairs.value.push(flair);
  }
};

// const handleSubmit = () => {
//   // Handle post submission
//   console.log({
//     type: postType.value,
//     community: selectedCommunity.value,
//     title: title.value,
//     content: content.value,
//     linkUrl: linkUrl.value,
//     image: selectedImage.value,
//     flairs: selectedFlairs.value,
//   })
// }

const setPostType = (type: 'text' | 'image' | 'link') => {
  postType.value = type
}

const setIsPreview = (value: boolean) => {
  isPreview.value = value
}

const setTitle = (value: string) => {
  title.value = value
}

const setContent = (value: string) => {
  content.value = value
}

const setLinkUrl = (value: string) => {
  linkUrl.value = value
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

const handleSubmit = async () => {
  try {
    loading.value = true;

    // Create the post
    const res = await $fetch('/api/posts', {
      method: 'POST',
      body:({
        type: postType.value,
        community: selectedCommunity.value,
        title: title.value,
        content: content.value,
        linkUrl: linkUrl.value,
        image: selectedImage.value,
        flairs: selectedFlairs.value,
      }),
    });

    const post = res.post;

    // Step 2: Upload the image and generate the unique filename
    if (selectedImage.value) {
      const filePath = generateUniqueFilename(selectedImage.value.name, post.id);
      const imageUrl = await uploadImage(selectedImage.value, filePath);

      // Step 3: Update the post with the new image URL
      await $fetch(`/api/posts/${post.id}`, {
        method: 'PATCH',
        body: {
          image_url: imageUrl,
        },
      });
    }

    // Add tags to the post
    await $fetch('/api/post_flairs', {
      method: 'POST',
      body: selectedFlairs.value.map((flair) => ({
        post_id: post.id,
        flair_id: flair,
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