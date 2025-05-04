<template>
    <div>
        <n-dropdown trigger="hover" :options="options" @select="changeTheme">
            <n-button quaternary type="default" size="medium">
                <template #icon>
                    <n-icon color="#fff">
                        <Language></Language>
                    </n-icon>
                </template>
            </n-button>
        </n-dropdown>
    </div>
</template>
<script setup lang="ts">
import { useEventBus } from '@/eventBus';
import { Language } from '@vicons/ionicons5';
import { NButton, type DropdownOption, NDropdown, NIcon } from 'naive-ui';
import { h, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const eventBus = useEventBus()
const theme = ref(localStorage.getItem('theme') || 'light')
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

const options = ref<DropdownOption[]>([
    {
        icon: () => h('img', {
            src: '/flags/uzbekistan.png',
            width: '20px'
        }),
        key: 'uz',
        label: "O'zbekcha",
    },
    {
        icon: () => h('img', {
            src: '/flags/russia.png',
            width: '20px'
        }),
        key: 'ru',
        label: "Русский",
    },
    {
        icon: () => h('img', {
            src: '/flags/usa.png',
            width: '20px'
        }),
        key: 'en',
        label: "English",
    },
    {
        icon: () => h('img', {
            src: '/flags/uzbekistan.png',
            width: '20px'
        }),
        key: 'uzk',
        label: "Ўзбекча",
    },
])
const changeTheme = (e: any) => {
    locale.value = e
    localStorage.setItem('language', e)
}
onMounted(() => {
    if (!['uz', 'ru', 'en', 'uzk'].includes(localStorage.getItem('language') ?? '')) {
        localStorage.setItem('language', 'uz')
    }
})
</script>
