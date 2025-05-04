<template>
  <div style="padding: 0 10px">
    <div>
      <RouterView v-slot="{ Component }">
        <Transition :name="'child-fade'" :mode="'out-in'">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.type-list {
  padding: 4px 16px;
  border-radius: 50px;
}
</style>
