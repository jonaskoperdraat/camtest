import Vue from 'vue'
import App from './App.vue'
import loadImage from 'blueimp-load-image';

Object.defineProperty(Vue.prototype, '$loadImage', { value: loadImage });

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
