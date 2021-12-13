import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import store from "../store";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "Login" */ "../views/Login.vue"),
  },
  {
    path: "/user/edit",
    name: "ManagerEditUserInfo",
    component: () =>
      import(
        /* webpackChunkName: "ManagerEditUserInfo" */ "../views/ManagerEditUserInfo.vue"
      ),
  },

  {
    path: "/manager/donations/create",
    name: "ManagerDonationCreate",
    component: () =>
      import(
        /* webpackChunkName: "ManagerDonationCreate" */ "../views/ManagerDonationCreate.vue"
      ),
  },
  {
    path: "/manager/donations/list",
    name: "ManagerDonationList",
    component: () =>
      import(
        /* webpackChunkName: "ManagerDonationList" */ "../views/ManagerDonationList.vue"
      ),
  },
  {
    path: "/manager/donations/inspect",
    name: "ManagerDonationInspect",
    component: () =>
      import(
        /* webpackChunkName: "ManagerDonationInspect" */ "../views/ManagerDonationInspect.vue"
      ),
  },
  {
    path: "/manager/donations/retrieve",
    name: "ManagerDonationRetrieve",
    component: () =>
      import(
        /* webpackChunkName: "ManagerDonationRetrieve" */ "../views/ManagerDonationRetrieve.vue"
      ),
  },
  {
    path: "/manager/families/subscribe",
    name: "ManagerFamilySubscribe",
    component: () =>
      import(
        /* webpackChunkName: "ManagerFamilySubscribe" */ "../views/ManagerFamilySubscribe.vue"
      ),
  },
  {
    path: "/manager/families/list",
    name: "ManagerFamilyList",
    component: () =>
      import(
        /* webpackChunkName: "ManagerFamilyList" */ "../views/ManagerFamilyList.vue"
      ),
  },
  {
    path: "/manager/families/check",
    name: "ManagerFamilyCheck",
    component: () =>
      import(
        /* webpackChunkName: "ManagerFamilyCheck" */ "../views/ManagerFamilyCheck.vue"
      ),
  },
  {
    path: "/manager/event/create",
    name: "ManagerEventCreate",
    component: () =>
      import(
        /* webpackChunkName: "ManagerEventCreate" */ "../views/ManagerEventCreate.vue"
      ),
  },
  {
    path: "/manager/event/list",
    name: "ManagerEventList",
    component: () =>
      import(
        /* webpackChunkName: "ManagerEventList" */ "../views/ManagerEventList.vue"
      ),
  },
  {
    path: "/manager/food/add",
    name: "ManagerFood",
    component: () =>
      import(/* webpackChunkName: "ManagerFood" */ "../views/ManagerFood.vue"),
  },
  {
    path: "/manager/pack/create",
    name: "ManagerPackCreate",
    component: () =>
      import(
        /* webpackChunkName: "ManagerPackCreate" */ "../views/ManagerPackCreate.vue"
      ),
  },
  {
    path: "/manager/pack/list",
    name: "ManagerPackList",
    component: () =>
      import(
        /* webpackChunkName: "ManagerPackList" */ "../views/ManagerPackList.vue"
      ),
  },
  {
    path: "/manager/pack/scan",
    name: "ManagerPackScan",
    component: () =>
      import(
        /* webpackChunkName: "ManagerPackScan" */ "../views/ManagerPackScan.vue"
      ),
  },
  {
    path: "/manager/pack/delivery",
    name: "ManagerPackDelivery",
    component: () =>
      import(
        /* webpackChunkName: "ManagerPackDelivery" */ "../views/ManagerPackDelivery.vue"
      ),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    // to, from, savedPosition
    const layoutContent = document.getElementById("content");
    layoutContent?.scrollTo(0, 0);
  },
});

router.beforeEach((to, from, next) => {
  //to, from, next
  if (store.getters.isUserLogged) {
    if (!store.getters.isMediumScreenWidth) {
      store.dispatch("showSidebar");
    }
  }

  next();
});

export default router;
