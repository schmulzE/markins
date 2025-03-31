<template>
  <RegisterLayout>
    <div data-theme="light" class="flex flex-col items-center justify-center h-screen bg-base-300">
      <div class="w-full max-w-md p-6 space-y-6 bg-base-100 rounded-lg shadow-lg">
        <div class="flex space-x-4 items-center">
          <img src="/svg/markins.svg" alt="logo" class="w-8" >
          <h1 class="text-3xl font-semibold">Let's get started</h1>
        </div>
        <form class="space-y-4" @submit.prevent="handleStandardSignup" >
          <div>
            <label for="username" class="block mb-2 font-medium text-gray-600 text-sm">Username*</label>
            <input 
            id="username" 
            v-model="state.username"  
            type="text" class="w-full p-2 border border-gray-400 rounded-md bg-base-100"
            placeholder="Enter username" 
            required 
            autocomplete="false"
            >
          </div>
          <div>
            <label for="email" class="block mb-2 font-medium text-gray-600 text-sm">Email*</label>
            <input 
            id="email" 
            v-model="state.email" 
            type="email" 
            class="w-full p-2 border border-gray-400 rounded-md bg-base-100"
            placeholder="Enter email" 
            required
            >
          </div>
          <div>
            <label for="password" class="block mb-2 font-medium text-gray-600 text-sm ">Password*</label>
            <input 
            id="password" 
            v-model="state.password" 
            type="password" 
            class="w-full p-2 border border-gray-400 rounded-md bg-base-100"
            placeholder="Enter password" 
            required
            >
          </div>
          <div>
            <label for="confirmPassword" class="block mb-2 font-medium text-gray-600 text-sm">Confirm Password*</label>
            <input 
            id="confirmPassword" 
            v-model="state.confirmPassword" 
            type="password"
            class="w-full p-2 border bg-base-100 border-gray-400 rounded-md" 
            placeholder="Confirm your password" 
            required
            >
          </div>
          <p class="mt-4 text-xs text-center text-gray-500">
            By proceeding, I agree to the <NuxtLink to="#">Privacy Statement</NuxtLink> and <NuxtLink to="#">Terms of Service</NuxtLink>
          </p>
          <button 
          :disabled="state.loading || state.password === '' || (state.confirmPassword !== state.password)" 
          type="submit"
          class="w-full py-2 text-white bg-green-600 rounded-md disabled:bg-green-400 disabled:cursor-not-allowed hover:bg-green-700"
          >
            Sign up
          </button>
          <p v-if="state.success" class="mt-4 text-lg text-center">You have successfully signed up. Please check your email for a link to confirm your email address and proceed.</p>
        </form>
        <p class="text-center text-sm text-accent-neutral">Already signed up? <NuxtLink to="/account/signin" class="text-blue-400">Sign in</NuxtLink></p>
      </div>
    </div>
  </RegisterLayout>
</template>

<script setup lang="ts">
  import { useToast } from 'vue-toastification';
  import RegisterLayout from '~/layouts/register.vue';

  type AccountState = {
    username: string , 
    email: string ,
    password: string,
    confirmPassword: string,
    error: string | undefined,
    loading: boolean,
    success: boolean | string,
  }
  
  const state = reactive<AccountState>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    loading: false,
    error: undefined,
    success: false,
  })

  const toast = useToast();

  const handleStandardSignup = async () => {
    state.loading = true;
    try {
      // Simulate a delay to mimic network request
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Show a toast notification instead of making a Supabase call
      toast.success('This feature is coming soon!');
    } catch {
      toast.error('An error occurred. Please try again later.');
    } finally {
      state.loading = false;
    }
  }
</script>