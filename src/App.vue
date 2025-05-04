<template>
  <div>
    <n-spin :show="loading || errorStore.globalLoading" size="large">
      <div style="width: 100%; min-height: 100vh">
        <template v-if="!loading">
          <RouterView v-slot="{ Component }">
            <transition name="slide-up">
              <component :is="Component" />
            </transition>
          </RouterView>
        </template>
      </div>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { useNotification, useMessage, useLoadingBar, NSpin } from "naive-ui";
import { onMounted, ref, watch } from "vue";
import { useErrorStore } from "@/stores/error";
import { useRouter } from "vue-router";
import bgImage from "@/assets/bg.webp";
import { userApi } from "@/api/main/actions/userApi";

const router = useRouter();
const errorStore = useErrorStore();
const notification = useNotification();
const message = useMessage();
const loadingBar = useLoadingBar();
const loading = ref(true);

const GetMe = () => {
  userApi.getMe().finally(() => {
    loading.value = false;
  });
};

onMounted(() => {
  GetMe();
});
watch(
  () => errorStore.error.new,
  () => {
    if (errorStore.error.new) {
      notification.error({ content: errorStore.error.message, duration: 5000 });
      if (errorStore.error.errors?.length) {
        for (const error of errorStore.error.errors) {
          message.error(error);
        }
      }
      errorStore.clearError();
    }
  }
);

router.beforeEach(() => {
  loadingBar.start();
});

router.afterEach(() => {
  loadingBar.finish();
});
router.onError(() => {
  loadingBar.error();
});
onMounted(() => {
  const backgroundImage = document.getElementById("background-image");
  if (backgroundImage) {
    backgroundImage.style = `
    position: fixed;
    left: 0;
    top: 0;
    z-index: -1;
    display: block;
    background-image: url(${bgImage}); 
    background-repeat: no-repeat; 
    background-position: center; 
    background-size: cover; 
    background-attachment: 
    fixed; -webkit-filter: blur(3px);
    -moz-filter: blur(3px);
    -o-filter: blur(3px);
    -ms-filter: blur(3px);
    filter: blur(3px);
    width: 100%;
    height: 100vh;
    transition: all 0.35s ease-in-out;
     opacity: 1;
    `;
  }
});
</script>
<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>
