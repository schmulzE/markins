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
              :disabled="!isValidName || !displayName || !description || !category"
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
              Build a place for your scientific community to connect and share knowledge
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Form -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Basic Information -->
              <CommunityFormSection
              v-model:community-category="category"
              v-model:community-name="communityName"
              v-model:community-description="description"
              v-model:community-display-name="displayName"
              :categories="categories"
              :is-valid-name="isValidName"
              />

              <!-- Appearance -->
              <CommunityAppearanceForm 
                v-model:banner-preview="bannerPreview"
                v-model:selected-icon="selectedIcon"
                :icon-options="iconOptions"
                @banner-image="bannerImage = $event"
              />

              <!-- Community Settings -->
              <CommunitySettings
                v-model:community-type="communityType"
                v-model:allow-images="allowImages"
                v-model:allow-links="allowLinks"
                v-model:require-approval="requireApproval"
                v-model:is-n-s-f-w="isNSFW"
              />

              <!-- Community Rules -->
               <CommunityRulesForm 
                  v-model:rules="rules"
                />
            </div>

            <!-- Sidebar -->
            <div class="lg:col-span-1 space-y-4">
              <!-- Preview -->
              <CommunityPreview 
                :selected-icon="selectedIcon"
                :community-name="communityName"
                :display-name="displayName"
                :banner-preview="bannerPreview"
                :description="description"
                :community-type="communityType"
                :category="category"
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
                    <span class="font-medium capitalize">{{ communityType }}</span>
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
import ForumNavbar from '~/components/header/forum-navbar.vue';
import CommunityPreview from '~/components/forum/community/community-preview.vue';
import CommunitySettings from '~/components/forum/community/community-settings.vue';
import CommunityRulesForm from '~/components/forum/community/community-rules-form.vue';
import CommunityFormSection from '~/components/forum/community/community-form-section.vue';
import CommunityAppearanceForm from '~/components/forum/community/community-appearance-form.vue';

// State
const category = ref("");
const isNSFW = ref(false);
const displayName = ref("");
const description = ref("");
const allowLinks = ref(true);
const selectedIcon = ref('');
const bannerPreview = ref("");
const communityName = ref("");
const allowImages = ref(true);
const rules = ref<string[]>([""]);
const requireApproval = ref(false);
const bannerImage = ref<File | null>(null);
const communityType = ref<"public" | "restricted" | "private">("public");

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
  return communityName.value.length >= 3 && 
         communityName.value.length <= 21 && 
         /^[a-zA-Z0-9_]+$/.test(communityName.value)
});

// Methods
const handleSubmit = () => {
  // Handle community creation
  console.log({
    name: communityName.value,
    displayName: displayName.value,
    description: description.value,
    category: category.value,
    type: communityType.value,
    isNSFW: isNSFW.value,
    allowImages: allowImages.value,
    allowLinks: allowLinks.value,
    requireApproval: requireApproval.value,
    rules: rules.value.filter((rule) => rule.trim()),
    icon: selectedIcon.value,
    banner: bannerImage.value,
  })
};
</script>