import { useSupabaseClient } from '#imports'

export const useStorage = () => {
  const client = useSupabaseClient()

  const downloadImage = async (path: string, bucket: 'avatars' | 'images') => {
    try {
      if (!path) return null
      const { data, error } = await client.storage.from(bucket).download(path)
      if (error) throw error
      return URL.createObjectURL(data)
    } catch (error) {
      console.error(`Error downloading image from ${bucket}:`, error)
      return null
    }
  }

  return { downloadImage }
}