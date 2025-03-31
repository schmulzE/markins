<template>
  <RegisterLayout>
    <div>
      <div data-theme="light" class="flex flex-col items-center justify-center h-screen bg-base-300">
        <div class="w-full max-w-md p-6 space-y-6 bg-base-100 rounded-lg shadow-lg">
          <h1 class="text-3xl font-bold text-center">Sign up</h1>
          <p class="text-center text-sm text-accent-neutral">
            Already signed up? <NuxtLink to="/account/signin" class="text-blue-400">sign in</NuxtLink>
          </p>
          <form class="space-y-4" @submit.prevent="handleStandardSignup" >
            <div>
              <label for="username" class="block mb-2 font-bold text-sm">Username</label>
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
              <label for="email" class="block mb-2 font-bold text-sm">Email</label>
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
              <label for="password" class="block mb-2 font-bold text-sm ">Password</label>
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
              <label for="confirmPassword" class="block mb-2 font-bold text-sm">Confirm Password</label>
              <input 
              id="confirmPassword" 
              v-model="state.confirmPassword" 
              type="password"
              class="w-full p-2 border bg-base-100 border-gray-400 rounded-md" 
              placeholder="Confirm your password" 
              required
              >
            </div>
            <button 
            :disabled="state.loading || state.password === '' || (state.confirmPassword !== state.password)" 
            type="submit"
            class="w-full py-2 text-white bg-green-600 rounded-md disabled:bg-green-400 disabled:cursor-not-allowed hover:bg-green-700"
            >
              Sign up
            </button>
              <p v-if="state.success" class="mt-4 text-lg text-center">You have successfully signed up. Please check your email for a link to confirm your email address and proceed.</p>
          </form>
          <p class="mt-4 text-xs text-center text-gray-500">
            By proceeding, I agree to the <NuxtLink to="#">Privacy Statement</NuxtLink> and <NuxtLink to="#">Terms of Service</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </RegisterLayout>
</template>

<script setup lang="ts">
import RegisterLayout from '~/layouts/register.vue';

const supabase = useSupabaseAuthClient();


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

  const handleStandardSignup = async () => {
    try {
      state.loading = true
      const { error } = await supabase.auth.signUp(
        { 
          email: state.email, 
          password: state.password, 
          options: {
            data: {
              username: state.username,
            },
            emailRedirectTo: 'http://localhost:3000/account/signin'
          },
        })
      if (error) {
        throw error
      }else {
        state.success = true;
      }
    } catch (error) {
      if(error instanceof Error)
        throw new Error(error.message)
    } finally {
      state.loading = false
    }
  }

  // const getURL = () => {
  //   let url =
  //     process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
  //     process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
  //     'http://localhost:3000/'
  //   // Make sure to include `https://` when not localhost.
  //   url = url.includes('http') ? url : `https://${url}`
  //   // Make sure to include a trailing `/`.
  //   url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
  //   return url
  // }

  // const { data, error } = await supabase.auth.signInWithOAuth({
  //   provider: 'github',
  //   options: {
  //     redirectTo: getURL(),
  //   },
  // })


  // onMounted(() => {
  //    // Listen for the SIGNED_IN event
  //    supabase.auth.onAuthStateChange((event, session) => {
  //     if (event === 'SIGNED_IN') {
  //       // User has confirmed their password
  //       handleSignIn(session?.user)
  //     }
  //   })
  // })

  // const handleSignIn = (user: User | undefined) => {
  //   // Redirect the user to your desired page
  //   if(user) {
  //     router.push({ name: 'posts' })
  //   }
  // }

  // watchEffect(() => {
  //   if (user.value) {
  //     navigateTo('/account/signin', { replace: true })
  //   }
  // })
</script>
