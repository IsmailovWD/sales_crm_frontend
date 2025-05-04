<template>
  <div class="view-account">
    <div class="view-account-container">
      <n-card :bordered="false">
        <div data-v-d47fa855="" class="view-account-top">
          <div class="view-account-top-logo">
            <img src="../../assets/account-logo.png" alt="" />
            <div
              style="
                overflow: hidden;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 10px;
              "
            >
              <div style="position: relative; z-index: 2">
                <mode-vue></mode-vue>
                <lang-vue></lang-vue>
              </div>
              <div ref="langRef" class="view-account-top-lang"></div>
            </div>
          </div>
          <div class="view-account-top-desc">Admin Pro</div>
        </div>
        <div>
          <n-form
            size="medium"
            ref="formRef"
            :model="credentials"
            :rules="rules"
            :show-label="false"
          >
            <n-form-item path="username">
              <n-input size="large" v-model:value="credentials.username">
                <template #prefix>
                  <n-icon size="18" :component="Person" />
                </template>
              </n-input>
            </n-form-item>
            <n-form-item path="password">
              <n-input
                type="password"
                show-password-on="mousedown"
                size="large"
                v-model:value="credentials.password"
              >
                <template #prefix>
                  <n-icon size="18" :component="LockClosed" />
                </template>
              </n-input>
            </n-form-item>
            <n-button
              :loading="loading"
              type="primary"
              size="large"
              block
              @click="handleClick"
              >{{ t("signIn") }}</n-button
            >
          </n-form>
        </div>
      </n-card>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { UserAttr } from "@/api/main/types";
import { LockClosed, Person } from "@vicons/ionicons5";
import {
  type FormRules,
  NForm,
  NFormItem,
  NInput,
  NIcon,
  NButton,
  type FormInst,
  NCard,
} from "naive-ui";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { authApi } from "@/api/main/actions/authApi";
import router from "@/router";
import { langVue, modeVue } from "@/components/header/global-header/components";

const langRef = ref<HTMLDivElement>();
const loading = ref(false);
const formRef = ref<FormInst>();
const { t } = useI18n();
const credentials = ref<Pick<UserAttr, "password" | "username">>({
  username: "",
  password: "",
});

const rules: FormRules = {
  username: {
    required: true,
    trigger: ["input", "blur"],
    message: () =>
      t("input_errors.{name} is required", { name: t("username") }),
  },
  password: {
    required: true,
    trigger: ["input", "blur"],
    message: () =>
      t("input_errors.{name} is required", { name: t("password") }),
  },
};

const handleClick = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      loading.value = true;
      authApi
        .singIn(credentials.value)
        .then((res) => {
          localStorage.setItem("token", res.token);
          router.push({ name: "dashboard" });
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};

onMounted(() => {
  if (import.meta.env.DEV) {
    credentials.value.username = "Programmer";
    credentials.value.password = "123456";
  }
  const bgDiv = document.getElementById("background-image");
  if (bgDiv && langRef.value) {
    const url = bgDiv
      .getAttribute("style")
      ?.split(";")
      .filter((s) => s.includes("background-image"))[0]
      .replace(/\s+/g, "")
      .replace("background-image:", "");
    if (url) {
      langRef.value.style.backgroundImage = `${url}`;
      console;
      langRef.value.style.top = `-${langRef.value.getClientRects()[0].top}px`;
      langRef.value.style.left = `-${langRef.value.getClientRects()[0].left}px`;
    }
  }
});
</script>
<style scoped>
.view-account {
  background-image: url("../../assets/bg.svg");
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 100%;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
}

.view-account-container {
  flex: 1;
  padding: 32px 12px;
  max-width: 384px;
  min-width: 320px;
  margin: 0 auto;
}

img {
  max-width: 100%;
  height: auto;
}

.view-account-top-desc {
  font-size: 14px;
  color: #808695;
  text-align: center;
}

.view-account-top-logo {
  display: grid;
  grid-template-columns: 85% 15%;
}
.view-account-top-lang {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 0;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
  width: 100vw;
  height: 100vh;
}
</style>
