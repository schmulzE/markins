import { defineNuxtPlugin } from '#app'
import { usePresence } from '~/composables/usePresence'

export default defineNuxtPlugin(() => {
  const { startPresenceTracking } = usePresence()
  
  return {
    provide: {
      initializePresence: startPresenceTracking,
    }
  }
})