<template>
    <div>
        <n-dropdown trigger="hover" :options="options" @select="changeTheme">
            <n-button quaternary type="default" size="medium">
                <template #icon>
                    <n-icon color="#fff">
                        <Sunny v-if="theme === 'light'"></Sunny>
                        <Moon v-if="theme === 'dark'"></Moon>
                        <DeviceMeetingRoom24Filled v-if="theme === 'auto'"></DeviceMeetingRoom24Filled>
                    </n-icon>
                </template>
            </n-button>
        </n-dropdown>
    </div>
</template>
<script setup lang="ts">
import { useEventBus } from '@/eventBus';
import { DeviceMeetingRoom24Filled } from '@vicons/fluent';
import { Moon, Sunny } from '@vicons/ionicons5';
import { NButton, NIcon, type DropdownOption, NDropdown } from 'naive-ui';
import { h, onMounted, onUnmounted, ref } from 'vue';
import useTheme from '@/composables/useTheme';

const eventBus = useEventBus()
const theme = ref(localStorage.getItem('theme') || 'light')
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

const options = useTheme().modeOptions
const changeDevice = (e: any) => {
    if (theme.value == 'auto') {
        changeTheme('auto')
    }
}
const changeTheme = (e: any) => {
    localStorage.setItem('theme', e)

    theme.value = e

    if (!['light', 'dark'].includes(e)) {
        e = (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }

    document.documentElement.className = e;

    eventBus.$emit('changeTheme', e)

}
onMounted(() => {
    mediaQuery.addEventListener('change', changeDevice)
})
onUnmounted(() => {
    mediaQuery.removeEventListener("change", changeDevice);
});
</script>
