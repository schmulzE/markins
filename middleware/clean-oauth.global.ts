import { defineNuxtRouteMiddleware, useRouter, useRoute } from 'nuxt/app'
import { useSupabaseUser } from '#imports'

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const router = useRouter()
  const route = useRoute()
  const user = useSupabaseUser()

  const hasOAuthParams = route.query.code || route.query.access_token || route.query.error
  const isAlreadyOnPostsPage = route.path === '/posts'

  if (!hasOAuthParams || isAlreadyOnPostsPage) return

  // Wait for user to be hydrated
  const waitForUser = () =>
    new Promise<void>((resolve) => {
      const check = () => {
        if (user.value) return resolve()
        setTimeout(check, 50)
      }
      check()
    })

  await waitForUser()

  // Clean the query parameters and redirect to /posts
  router.replace({ path: '/posts' })
})
