<template>
  <BaseLayout>
    <template #header>
      <ForumNavbar>
        <template #dynamic-content>
          <div class="flex items-center space-x-2 md:space-x-4">
            <button class="btn btn-outline">
              <NuxtLink to="/communities">Cancel</NuxtLink>
            </button>
            <button
              class="bg-[#297D4E] hover:bg-[#1f5a37] btn"
              :disabled="!isValidName || !newCommunity.name || !newCommunity.description || !newCommunity.category || loading"
              @click="handleSubmit"
              >
              Create Community
            </button>
          </div>
        </template>
      </ForumNavbar>
    </template>
    <template #main>
      <div class=" px-4 py-6">
        <div class="max-w-4xl mx-auto">
          <div class="mb-8">
            <h1 class="text-3xl font-bold mb-2">Create a Community</h1>
            <p class="text-base-content">
              Build a place for your scientific newCommunity to connect and share knowledge
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Form -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Basic Information -->
              <CommunityFormSection
              v-model:community-category="newCommunity.category"
              v-model:community-name="newCommunity.name"
              v-model:community-description="newCommunity.description"
              v-model:community-display-name="newCommunity.slug"
              :categories="categories"
              :is-valid-name="isValidName"
              />

              <!-- Appearance -->
              <CommunityAppearanceForm 
                v-model:banner-preview="bannerPreview"
                v-model:selected-icon="newCommunity.icon"
                :icon-options="iconOptions"
                @banner-image="newCommunity.bannerImage = $event"
              />

              <!-- Community Settings -->
              <CommunitySettings
                v-model:community-type="newCommunity.type"
                v-model:allow-images="newCommunity.allowImages"
                v-model:allow-links="newCommunity.allowLinks"
                v-model:require-approval="newCommunity.requireApproval"
              />

              <!-- Community Rules -->
               <CommunityRulesForm 
                  v-model:rules="newCommunity.rules"
                />
            </div>

            <!-- Sidebar -->
            <div class="lg:col-span-1 space-y-4">
              <!-- Preview -->
              <CommunityPreview 
                :selected-icon="newCommunity.icon"
                :community-name="newCommunity.name"
                :display-name="newCommunity.slug"
                :banner-preview="bannerPreview"
                :description="newCommunity.description"
                :community-type="newCommunity.type"
                :category="newCommunity.category"
                :categories="categories"
              />

              <!-- Guidelines -->
              <div class="shadow bg-base-100 border p-4 border-gray-300 dark:border-base-100">
                <div class="text-lg flex items-center mb-4 font-medium">
                  <i class="i-lucide-alert-circle h-5 w-5 mr-2 text-[#297D4E]" />
                  Guidelines
                </div>
                <div class="space-y-4 text-sm">
                  <div class="flex items-start space-x-2">
                    <i class="i-lucide-alert-circle h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p>Community names cannot be changed after creation</p>
                  </div>
                  <div class="flex items-start space-x-2">
                    <i class="i-lucide-alert-circle h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p>Choose a clear, descriptive name that reflects your community's purpose</p>
                  </div>
                  <div class="flex items-start space-x-2">
                    <i class="i-lucide-alert-circle h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p>Follow ScienceForum's community guidelines and content policy</p>
                  </div>
                  <div class="flex items-start space-x-2">
                    <i class="i-lucide-alert-circle h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p>You will become the primary moderator of this community</p>
                  </div>
                </div>
              </div>

              <!-- Community Stats -->
              <div class="shadow bg-base-100 border px-4 py-8 border-gray-300 dark:border-base-100">     
                <div class="text-lg flex items-center mb-4 font-medium">
                  <i class="i-lucide-users h-5 w-5 mr-2 text-[#297D4E]" />
                  What to Expect
                </div>       
                <div class="space-y-3 text-sm">
                  <div class="flex justify-between">
                    <span>Initial members</span>
                    <span class="font-medium">1 (you)</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Moderators</span>
                    <span class="font-medium">1 (you)</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Visibility</span>
                    <span class="font-medium capitalize">{{ newCommunity.type }}</span>
                  </div>
                  <div class="pt-2 border-t border-gray-200 dark:border-base-100">
                    <p class="text-base-content">
                      You can invite moderators and customize your community after creation
                    </p>
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
import type { Community } from '~/types/utility';
import ForumNavbar from '~/components/header/forum-navbar.vue';
import CommunityPreview from '~/components/forum/community/community-preview.vue';
import CommunitySettings from '~/components/forum/community/community-settings.vue';
import CommunityRulesForm from '~/components/forum/community/community-rules-form.vue';
import CommunityFormSection from '~/components/forum/community/community-form-section.vue';
import CommunityAppearanceForm from '~/components/forum/community/community-appearance-form.vue';


export interface CommunityData {
  name: string;
  slug: string;
  icon: string;
  rules: string[];
  category: string;
  description: string;
  allowLinks: boolean;
  allowImages: boolean;
  requireApproval: boolean;
  bannerImage: File | null;
  type: "public" | "restricted" | "private";
}

const toast = useToast();
const user = useSupabaseUser();
const { uploadImage } = useImageHandler();

// State
const loading =ref(false);
const bannerPreview = ref("");
const newCommunity = ref<CommunityData>({
  name: '',
  slug: '',
  icon: '',
  rules: [""],
  category: '',
  type: "public",
  description: '',
  allowLinks: true,
  allowImages: true,
  bannerImage: null,
  requireApproval: false,
});

const categories = [
  { id: "physics", name: "Physics", icon: "⚛️" },
  { id: "biology", name: "Biology", icon: "🧬" },
  { id: "chemistry", name: "Chemistry", icon: "⚗️" },
  { id: "astronomy", name: "Astronomy", icon: "🔭" },
  { id: "mathematics", name: "Mathematics", icon: "📐" },
  { id: "engineering", name: "Engineering", icon: "⚙️" },
  { id: "medicine", name: "Medicine", icon: "🏥" },
  { id: "environment", name: "Environment", icon: "🌍" },
  { id: "computer-science", name: "Computer Science", icon: "💻" },
  { id: "other", name: "Other", icon: "🔬" },
];

const iconOptions = ["⚛️", "🧬", "⚗️", "🔭", "📐", "⚙️", "🏥", "🌍", "💻", "🔬", "🧪", "🦠", "🌟", "🔥", "⚡", "🌱"];

// Computed
const isValidName = computed(() => {
  return newCommunity.value.name.length >= 3 && 
         newCommunity.value.name.length <= 21 && 
         /^[a-zA-Z0-9_]+$/.test(newCommunity.value.name)
});

// Methods
const handleSubmit = async () => {
  try {
    loading.value = true;

    const res = await $fetch<{ data: Community }>('/api/communities', {
      method: 'POST',
      body: ({
        name: newCommunity.value.name,
        slug: newCommunity.value.slug,
        icon: newCommunity.value.icon,
        type: newCommunity.value.type,
        rules: newCommunity.value.rules,
        category: newCommunity.value.category,
        allow_links: newCommunity.value.allowLinks,
        description: newCommunity.value.description,
        allow_images: newCommunity.value.allowImages,
        require_approval: newCommunity.value.requireApproval
      }),
    });

    const community = res.data;

    // Step 2: Upload the image and generate the unique filename
    if (newCommunity.value.bannerImage) {
      const imagePath = await uploadImage(newCommunity.value.bannerImage, 'community-banners', community?.id)

      // Step 3: Update the post with the new image URL
      await $fetch(`/api/communities/update/${community.id}`, {
        method: 'PATCH',
        body: {
          banner_url: imagePath,
        },
      });
    }

    await $fetch(`/api/community_members`, {
      method: 'POST',
      body: {
        user_id: user.value?.id, 
        community_id: community.id, 
        is_moderator: true, 
        is_approved: true
      },
    });

    toast.success('Community successfully created!');
    navigateTo(`m/${community.slug}`);

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