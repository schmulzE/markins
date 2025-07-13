export const useTheme = () => {
  const theme = ref('light')
  
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    updateTheme()
  }
  
  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    if (newTheme === 'system') {
      theme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      theme.value = newTheme
    }
    updateTheme()
  }
  
  const updateTheme = () => {
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', theme.value)
      localStorage.setItem('theme', theme.value)
    }
  }
  
  const initTheme = () => {
    if (import.meta.client) {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        theme.value = savedTheme
      } else {
        theme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      updateTheme()
    }
  }
  
  return {
    theme: readonly(theme),
    toggleTheme,
    setTheme,
    initTheme
  }
}