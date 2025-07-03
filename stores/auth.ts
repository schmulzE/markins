import { defineStore } from 'pinia';
import type { Profile } from '~/types/utility';

export const useAuthStore = defineStore('auth', () => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  
  const isAuthResolved = ref(false);
  const isAuthenticated = ref(false);
  const profile = ref<Profile | null>(null);

  // Watch for user session changes
  watch(user, async (newUser) => {
    isAuthenticated.value = !!newUser
    isAuthResolved.value = true

    if (newUser) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', newUser.id)
        .single()

      if (!error) {
        profile.value = data as Profile;
      }
    } else {
      profile.value = null
    }
  }, { immediate: true })

  return {
    user,
    profile,
    isAuthenticated,
    isAuthResolved
  }
})
