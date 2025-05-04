import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { formatCurrency, parseCurrency } from "./utils/formatCurrency";
import Main from "./Main.vue";
import router from "./router";
import i18n from "./i18n";

const app = createApp(Main);

app.config.globalProperties.$formatCurrency = formatCurrency;
app.config.globalProperties.$parseCurrency = parseCurrency;

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount("#app");
