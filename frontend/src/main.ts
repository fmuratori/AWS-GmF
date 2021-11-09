import Vue from "vue";
import { CreateElement } from "vue/types/vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

/* font awesome i */
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(fas);
Vue.component("font-awesome-icon", FontAwesomeIcon);

/* bootstrap-vue imports */
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

/* socketio vuejs based implementation */
import SocketIO from "./socket";
Vue.use(SocketIO);

/* vue google maps components */
// look here for documentation: https://www.npmjs.com/package/gmap-vue
import * as VueGoogleMaps from "gmap-vue"
 
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAa30oqoeorf38Qsx5Nmv4g8GFhJFuP-wM",
    libraries: "places", 
  },
  installComponents: true
})

/* local style sheet */
import "./assets/style.scss";

/* vue instance creation */
new Vue({
  router,
  store,
  render: (h: CreateElement) => h(App),
}).$mount("#app");
