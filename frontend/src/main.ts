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

import vueCookies from "vue-cookies";
Vue.use(vueCookies);

/* socketio vuejs based implementation */
import vueSocket from "./socket";
Vue.use(vueSocket);

/* vue google maps components */
// look here for documentation: https://www.npmjs.com/package/gmap-vue
import * as VueGoogleMaps from "gmap-vue";

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_MAPS_API_KEY,
    libraries: "places",
  },
  installComponents: true,
  autobindAllEvents: false,
});

import VueGoogleAutocomplete from "vue-google-autocomplete"
Vue.component("vue-google-autocomplete", VueGoogleAutocomplete);


/* enable moment package usage inside html/pug code */
import moment from "moment";
Vue.prototype.moment = moment;

/* local style sheet */
import "./assets/style.scss";

/* vue instance creation */
new Vue({
  router,
  store,
  render: (h: CreateElement) => h(App),
}).$mount("#app");
