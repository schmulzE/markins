import { defineNuxtPlugin } from '#app';
import 'vue-toastification/dist/index.css'; 
import Toast, { type PluginOptions, POSITION } from "vue-toastification";

export default defineNuxtPlugin((nuxtApp) => {
  const options: PluginOptions = {
    timeout: 3000, // Default toast duration
    position: POSITION.TOP_RIGHT,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false
  };

  nuxtApp.vueApp.use(Toast, options);
});