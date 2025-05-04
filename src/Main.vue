<template>
    <App></App>
</template>
<script setup lang="ts">
import { createEventBus, useEventBus } from '@/eventBus'
import App from './components/Provided.vue';

createEventBus()
</script>