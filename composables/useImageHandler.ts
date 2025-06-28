import { useSupabaseClient } from '#imports'

export const useImageHandler = () => {
  const supabase = useSupabaseClient()

  const getImageUrl = (url: string | null, bucket: string) => {
    if (!url) return null

    // Return directly if full URL (e.g. Google avatar)
    if (url.startsWith('http')) return url

    // Else generate a public URL from Supabase Storage
    const { data } = supabase.storage.from(bucket).getPublicUrl(url)
    return data?.publicUrl || null
  }

  const uploadImage = async (
    file: File,
    bucket: 'avatars' | 'post-images' | 'community-banners',
    identifier: string
  ) => {
    if (!file || !file.type.startsWith('image/')) {
      throw new Error('Invalid image file')
    }

    if (file.size > 2 * 1024 * 1024) {
      throw new Error('File too large (max 2MB)')
    }

    const filePath = `${bucket}/${identifier}-${Date.now()}.${file.name.split('.').pop()}`

    const { error: uploadError } = await supabase
      .storage
      .from(bucket)
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      })

    if (uploadError) throw uploadError

    return filePath // Return the path to store in DB
  }

  const deleteImage = async (bucket: string, path: string) => {
    if (!path || path.startsWith('http')) return // Don't delete external images
    await supabase.storage.from(bucket).remove([path])
  }

  return {
    getImageUrl,
    uploadImage,
    deleteImage
  }
}
