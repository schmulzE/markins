<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div class=" flex h-16 items-center justify-between px-4">
        <NuxtLink to="/communities" class="flex items-center space-x-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#297D4E]">
            <i class="i-lucide-i h-5 w-5 text-white" />
          </div>
          <span class="text-xl font-bold text-[#297D4E]">ScienceForum</span>
        </NuxtLink>

        <div class="flex items-center space-x-4">
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
      </div>
    </header>

    <div class=" px-4 py-6">
      <div class="max-w-4xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold mb-2">Create a Community</h1>
          <p class="text-gray-500">
            Build a place for your scientific community to connect and share knowledge
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Form -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Basic Information -->
            <div class="shadow border bg-base-100 p-4 border-gray-300">        
              <div class="flex items-center font-medium mb-4">
                <i class="i-lucide-info h-5 w-5 mr-2 text-[#297D4E]" />
                Basic Information
              </div>
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="label" for="community-name">Community Name *</label>
                  <label class="input block w-full relative" >
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">m/</span>
                    <input
                      id="community-name"
                      placeholder="quantumphysics"
                      :value="communityName"
                      class="pl-8"
                      @input="setCommunityName(($event.target as HTMLInputElement).value.toLowerCase())"
                      >
                  </label>
                  <div class="flex items-center justify-between text-sm">
                    <span :class="isValidName ? 'text-green-600' : 'text-red-500'">
                      {{ communityName.length }}/21 characters
                    </span>
                    <span v-if="!isValidName && communityName" class="text-red-500">Only letters, numbers, and underscores allowed</span>
                  </div>
                </div>

                <div class="space-y-2">
                  <label for="display-name" class="label">Display Name *</label>
                  <input
                    id="display-name"
                    class="input block w-full"
                    placeholder="Quantum Physics"
                    :value="displayName"
                    @input="displayName = ($event.target as HTMLInputElement).value"
                  >
                </div>

                <div class="space-y-2">
                  <label for="description" class="label">Description *</label>
                  <textarea
                    id="description"
                    class="textarea block w-full"
                    placeholder="A community for discussing quantum mechanics, quantum computing, and quantum technologies"
                    :value="description"
                    rows="3"
                    @input="description = ($event.target as HTMLTextAreaElement).value"
                    />
                  <p class="text-sm text-gray-500">{{ description.length }}/500 characters</p>
                </div>

                <div class="space-y-2">
                  <label for="category" class="label">Category *</label>
                  <select class="select w-full block" :value="category" @update:value="setCategory">
                    <option disabled selected>Select a category</option>                  
                      <option v-for="cat in categories" :key="cat.id" :value="cat.id" class="flex items-center space-x-2">
                        {{ cat.icon }}
                        {{ cat.name }}
                      </option>                 
                  </select>
                </div>
              </div>
            </div>

            <!-- Appearance -->
            <div class="shadow bg-base-100 border p-4 border-gray-300">          
              <div class="flex items-center font-medium mb-4">
                <i class="i-lucide-palette h-5 w-5 mr-2 text-[#297D4E]" />
                Appearance
              </div> 
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="label">Community Icon</label>
                  <div class="grid grid-cols-8 gap-2">
                    <button
                      v-for="icon in iconOptions"
                      :key="icon"
                      class="btn"
                      :class="`p-3 text-2xl rounded-lg border-2 transition-colors ${
                        selectedIcon === icon
                        ? 'border-[#297D4E] bg-[#297D4E]/10'
                        : 'border-gray-200 hover:border-gray-300'
                        }`"
                      @click="selectedIcon = icon"
                    >
                      {{ icon }}
                    </button>
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="label">Banner Image (optional)</label>
                  <div v-if="!bannerPreview" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <i class="i-lucide-upload h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p class="text-gray-500 mb-4">Upload a banner image (1200x300px recommended)</p>
                    <input
                      id="banner-upload"
                      ref="bannerUploadInput"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleBannerUpload"
                    >
                    <button class="btn btn-outline text-gray-500 border-gray-300" @click="triggerBannerUpload">
                      Choose File
                    </button>
                  </div>
                  <div v-else class="relative">
                    <div class="relative w-full h-32 rounded-lg overflow-hidden">
                      <img
                        :src="bannerPreview"
                        alt="Banner preview"
                        class="object-cover w-full h-full"
                      >
                    </div>
                    <button
                      class="btn btn-error absolute top-2 right-2"
                      @click="clearBanner"
                    >
                      <i class="i-lucide-x h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Community Settings -->
            <div class="shadow bg-base-100 border p-4 border-gray-300">    
              <div class="flex items-center font-medium mb-4">
                <i class="i-lucide-settings h-5 w-5 mr-2 text-[#297D4E]" />
                Community Settings
              </div>       
              <div class="space-y-4">
              <div class="space-y-2">
                <label class="label">Community Type</label>
                <select class="select w-full block" :value="communityType" @update:value="setCommunityType">                  
                  <option value="public" selected class="font-medium">
                   Public
                  </option>
                  <option value="restricted" class="flex flex-col gap-y-1 font-medium">
                    Restricted
                  </option>
                  <option value="private" class="font-medium">
                    Private
                  </option>                  
                </select>
              </div>

                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="space-y-1">
                      <label>Allow image posts</label>
                      <p class="text-sm text-gray-500">Members can upload images</p>
                    </div>
                    <input 
                    type="checkbox" 
                    :checked="allowImages" 
                    class="toggle checked:bg-[#297D4E] checked:border-[#297D4E] checked:text-white" 
                    @update:checked="allowImages = $event" 
                    >
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="space-y-1">
                      <label>Allow link posts</label>
                      <p class="text-sm text-gray-500">Members can share external links</p>
                    </div>
                    <input 
                    type="checkbox" 
                    :checked="allowLinks" 
                    class="toggle checked:bg-[#297D4E] checked:border-[#297D4E] checked:text-white" 
                    @update:checked="allowLinks = $event" 
                    >
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="space-y-1">
                      <label>Require post approval</label>
                      <p class="text-sm text-gray-500">All posts must be approved by moderators</p>
                    </div>
                    <input 
                    type="checkbox" 
                    class="toggle checked:bg-[#297D4E] checked:border-[#297D4E] checked:text-white" 
                    :checked="requireApproval" 
                    @update:checked="requireApproval = $event" 
                    >
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="space-y-1">
                      <label>NSFW content</label>
                      <p class="text-sm text-gray-500">Community contains mature content</p>
                    </div>
                    <input 
                    type="checkbox" 
                    class="toggle checked:bg-[#297D4E] checked:border-[#297D4E] checked:text-white" 
                    :checked="isNSFW" 
                    @update:checked="isNSFW = $event"
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Community Rules -->
            <div class="shadow bg-base-100 border p-4 border-gray-300"> 
              <div class="flex items-center font-medium mb-4">
                <i class="i-lucide-shield h-5 w-5 mr-2 text-[#297D4E]" />
                Community Rules
              </div>     
              <div class="space-y-4">
                <p class="text-sm text-gray-500">Set clear guidelines for your community members</p>

                <div class="space-y-3">
                  <div v-for="(rule, index) in rules" :key="index" class="flex items-center space-x-2">
                    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[#297D4E]/10 text-[#297D4E] text-sm font-medium flex items-center justify-center">
                      {{ index + 1 }}
                    </div>
                    <input
                      placeholder="Enter a community rule"
                      :value="rule"
                      class="flex-1 input"
                      @input="updateRule(index, ($event.target as HTMLInputElement).value)"
                    >
                    <button v-if="rules.length > 1" variant="ghost" size="sm" @click="removeRule(index)">
                      <i class="i-lucide-x h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button 
                class="w-full btn btn-outline"
                @click="addRule" 
                >
                  <i class="i-lucide-plus h-4 w-4 mr-2" />
                  Add Rule
                </button>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1 space-y-4">
            <!-- Preview -->
            <div class="shadow bg-base-100 border p-4 border-gray-300">     
              <div class="text-lg flex items-center mb-4 font-medium">
                <i class="i-lucide-eye h-5 w-5 mr-2 text-[#297D4E]" />
                Preview
              </div>
              <div>
                <div class="space-y-4">
                  <div class="flex items-center space-x-3">
                    <div class="text-2xl">{{ selectedIcon || "🔬" }}</div>
                    <div>
                      <h3 class="font-semibold">{{ communityName ? `m/${communityName}` : "m/yourcommunity" }}</h3>
                      <p class="text-sm text-gray-500">{{ displayName || "Your Community" }}</p>
                    </div>
                  </div>

                  <div v-if="bannerPreview" class="relative w-full h-20 rounded-lg overflow-hidden">
                    <img
                      :src="bannerPreview"
                      alt="Banner preview"
                      class="object-cover w-full h-full"
                    >
                  </div>

                  <p class="text-sm text-gray-700">
                    {{ description || "Your community description will appear here" }}
                  </p>

                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span>Type</span>
                      <div class="badge capitalize">
                        {{ communityType }}
                      </div>
                    </div>
                    <div class="flex justify-between">
                      <span>Category</span>
                      <span class="text-gray-500">
                        {{ category ? categories.find((c) => c.id === category)?.name : "Not selected" }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Guidelines -->
            <div class="shadow bg-base-100 border p-4 border-gray-300">
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
            <div class="shadow bg-base-100 border px-4 py-8 border-gray-300">     
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
                <div class="pt-2 border-t border-gray-200">
                  <p class="text-gray-500">
                    You can invite moderators and customize your community after creation
                  </p>
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
// State
const isNSFW = ref(false)
const category = ref("")
const displayName = ref("")
const description = ref("")
const allowLinks = ref(true)
const communityName = ref("")
const bannerPreview = ref("")
const selectedIcon = ref('');
const allowImages = ref(true)
const rules = ref<string[]>([""])
const requireApproval = ref(false)
const bannerImage = ref<File | null>(null)
const bannerUploadInput = ref<HTMLInputElement | null>(null)
const communityType = ref<"public" | "restricted" | "private">("public")

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
]

const iconOptions = ["⚛️", "🧬", "⚗️", "🔭", "📐", "⚙️", "🏥", "🌍", "💻", "🔬", "🧪", "🦠", "🌟", "🔥", "⚡", "🌱"]

// Computed
const isValidName = computed(() => {
  return communityName.value.length >= 3 && 
         communityName.value.length <= 21 && 
         /^[a-zA-Z0-9_]+$/.test(communityName.value)
})

// Methods
const handleBannerUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    bannerImage.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      bannerPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const clearBanner = () => {
  bannerImage.value = null
  bannerPreview.value = ""
}

const addRule = () => {
  rules.value = [...rules.value, ""]
}

const updateRule = (index: number, value: string) => {
  const newRules = [...rules.value]
  newRules[index] = value
  rules.value = newRules
}

const removeRule = (index: number) => {
  rules.value = rules.value.filter((_, i) => i !== index)
}

const setCommunityName = (value: string) => {
  communityName.value = value.toLowerCase()
}

const setCategory = (value: string) => {
  category.value = value
}

const setCommunityType = (value: "public" | "restricted" | "private") => {
  communityType.value = value
}

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
}

const triggerBannerUpload = () => {
  bannerUploadInput.value?.click()
}
</script>