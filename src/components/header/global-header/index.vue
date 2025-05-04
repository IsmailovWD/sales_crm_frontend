<template>
    <div style="position: relative; z-index: 1;">
        <n-layout-header :bordered="false">
            <div style="padding: 10px 20px 10px 0; display: flex; justify-content: space-between;">
                <n-flex align="center">
                    <n-button @click="eventBus.$emit('toggleCollapsed')" quaternary type="default" size="medium">
                        <template #icon>
                            <n-icon color="#fff">
                                <Menu></Menu>
                            </n-icon>
                        </template>
                    </n-button>
                    <n-text style="font-size: large; line-height: 0; color: #fff;">
                        {{ t(`sidebar.${route.name as string}`) }} <!-- Fix -->
                    </n-text>
                </n-flex>
                <n-flex align="center" :size="0">
                    <lang-vue></lang-vue>
                    <mode-vue></mode-vue>
                    <n-divider vertical></n-divider>
                    <user-vue></user-vue>
                </n-flex>
            </div>
        </n-layout-header>
    </div>
</template>

<script setup lang="ts">
import { NLayoutHeader, NFlex, NDivider, NButton, NIcon, NSpace, NText } from 'naive-ui'
import { modeVue, userVue, langVue } from './components'
import { Menu } from '@vicons/ionicons5'
import { useEventBus } from '@/eventBus'
import { useI18n } from 'vue-i18n' // $t ni olish
import { useRoute } from 'vue-router' // $route ni olish

const eventBus = useEventBus()
const { t } = useI18n() // $t funksiyasini olish
const route = useRoute() // $route o'zgaruvchisini olish
</script>
