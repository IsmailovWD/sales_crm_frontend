<template>
    <n-dropdown :options="options">
        <n-avatar
            round
            :size="'medium'"
            src="/user.jpeg"
        />
    </n-dropdown>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import {
    Pencil as EditIcon,
    LogOutOutline as LogoutIcon,
    PersonCircleOutline as UserIcon
} from '@vicons/ionicons5'
import { NIcon, NDropdown, NAvatar } from 'naive-ui'
import { defineComponent, h } from 'vue'

function renderIcon(icon: Component) {
    return () => {
        return h(NIcon, null, {
            default: () => h(icon)
        })
    }
}

const options = [
    {
        label: 'Profile',
        key: 'profile',
        icon: renderIcon(UserIcon)
    },
    {
        label: 'Edit Profile',
        key: 'editProfile',
        icon: renderIcon(EditIcon)
    },
    {
        label: 'Logout',
        key: 'logout',
        icon: renderIcon(LogoutIcon)
    }
]

</script>