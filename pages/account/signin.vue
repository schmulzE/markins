<template>
  <RegisterLayout>
    <div data-theme="light" class="flex flex-col items-center justify-center h-screen bg-base-300">
      <div class="w-full max-w-md p-6 space-y-6 bg-base-100 rounded-lg shadow-lg">
        <h1 class="text-3xl font-bold text-center">Sign in</h1>
        <p class="text-center text-sm text-accent-neutral">
          Don't have an account?, <NuxtLink to="/account/signup" class="text-blue-400">sign up</NuxtLink>
        </p>
        <form class="space-y-4" @submit.prevent="handleStandardSignin" >
          <div>
            <label for="email" class="block mb-2 font-medium">Email</label>
            <input 
            id="email" 
            v-model="state.email" 
            type="email" 
            class="w-full p-2 border border-gray-400 rounded-md"
            placeholder="Enter your email" 
            required
            >
          </div>
          <div>
            <label for="password" class="block mb-2 font-medium">Password</label>
            <input 
            id="password" 
            v-model="state.password" 
            type="password" 
            class="w-full p-2 border border-gray-400 rounded-md"
            placeholder="Enter your password" 
            required
            >
          </div>
          <button 
          :disabled="state.loading || state.password == ''" 
          type="submit"
          class="w-full py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed flex justify-center content-center gap-x-2">
          <span v-if="state.loading" class="loading loading-spinner" />
          <span>Sign in</span>
        </button>
        </form>
      </div>
    </div>
  </RegisterLayout>
  </template>
  
<script setup lang="ts">
import RegisterLayout from '~/layouts/register.vue';

const supabase = useSupabaseClient();

type AccountState = {
  loading: boolean,
  success: boolean | string,
  email: string | undefined,
  password: string | undefined,
  error: string | undefined,
}

const state = reactive<AccountState>({
  loading: false,
  success: false,
  email: undefined,
  error: undefined,
  password: undefined,
})
  
const handleStandardSignin = async () => {
  try {
    state.loading = true
    const { error } = await supabase.auth.signInWithPassword({ email: state.email as string, password: state.password as string})
    if (error) {
      state.error = error as unknown as string
    }
    else {  
      state.loading = false; 
      navigateTo('/posts', {replace: true})
    }
  } catch {
    state.error = "Error coming from supabase"
  }
}
</script>
  
  <style scoped>
  
  </style>