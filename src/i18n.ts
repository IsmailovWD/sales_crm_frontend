import { createI18n, useI18n } from 'vue-i18n'
import uz from './locale/uz.json'
import uzk from './locale/uzk.json'
import ru from './locale/ru.json'
import en from './locale/en.json'

const savedLocale = localStorage.getItem('language') || 'uz'

const i18n = createI18n({
    legacy: false,
    locale: savedLocale,
    fallbackLocale: 'uz',
    messages: {
        uz,
        uzk,
        ru,
        en
    }
})

export default i18n
export { useI18n }
