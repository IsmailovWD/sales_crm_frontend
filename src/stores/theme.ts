import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
    const theme = ref<'light' | 'dark'>('light')

    const setTheme = (value: 'light' | 'dark') => {
        theme.value = value
    }

    return { theme, setTheme }
})
