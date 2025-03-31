<script setup lang="ts">
import { reactive } from 'vue'
import { useAuth } from "@/composables/useAuth"
const supabase = useSupabaseAuthClient()

definePageMeta({
  layout: "register",
});

type AccountState = {
  loading: boolean,
  success: boolean | string,
  email: string | undefined,
  error: string | undefined,
}

const state = reactive<AccountState>({
  loading: false,
  success: false,
  email: undefined,
  error: undefined,
})

const { validateEmail } = useAuth()

const recoverPassword = async () => {
  state.error = undefined;
  if (!validateEmail(state.email as string)) {
    state.error = "Enter a valid email."
    return
  }
  try {
    state.loading = true
    let { data, error } = await supabase
      .auth
      .resetPasswordForEmail(state.email as string)

    if (data) {
      state.success = "Successfully reset password."
    }
  } catch (error) {
    state.error = "Error coming from Supabase."
  } finally {
    state.loading = false
  }
}

const closeErrorModal = (payload: string) => {
  state.error = payload
}
const closeSuccessModal = (payload: string) => {
  state.success = payload
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen bg-base-300">
    <div class="w-full max-w-md p-6 space-y-6 bg-base-100 rounded-lg shadow-lg">
      <h1 class="text-3xl font-medium text-center text-content">Recover Pasword</h1>
      <p class="text-center text-sm text-accent-neutral">You'll receive an email to recover your password.</p>
      <form @submit.prevent="recoverPassword" class="space-y-4">
        <div>
          <label for="email" class="block mb-2 font-medium text-content">Email</label>
          <input 
          v-model="state.email" 
          id="email" 
          type="email" 
          class="w-full input p-2 border border-gray-400 bg-base-100 rounded-md"
          placeholder="Enter your email" 
          required
          >
        </div>
        <button 
        :disabled="state.loading || state.email === ''" 
        type="submit"
        class="w-full py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
        Send Reset Password Link
      </button>
      </form>
    </div>
  </div>
</template>