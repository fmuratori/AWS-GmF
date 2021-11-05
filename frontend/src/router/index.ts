import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
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
    path: "/manager",
    name: "ManagerHome",
    component: () =>
      import(/* webpackChunkName: "ManagerHome" */ "../views/ManagerHome.vue"),
  },
  {
    path: "/user/edit",
    name: "ManagerEditUser",
    component: () =>
      import(/* webpackChunkName: "ManagerHome" */ "../views/ManagerEditUser.vue"),
  },

  {
    path: "/manager/donations/create",
    name: "ManagerDonationsCreate",
    component: () =>
      import(
        /* webpackChunkName: "ManagerDonationsCreate" */ "../views/ManagerDonationsCreate.vue"
      ),
  },
  {
    path: "/manager/donations/list",
    name: "ManagerDonationsList",
    component: () =>
      import(
        /* webpackChunkName: "ManagerDonationsList" */ "../views/ManagerDonationsList.vue"
      ),
  },
  {
    path: "/manager/donations/inspect",
    name: "ManagerDonationsInspect",
    component: () =>
      import(
        /* webpackChunkName: "ManagerDonationsInspect" */ "../views/ManagerDonationsInspect.vue"
      ),
  },
  {
    path: "/manager/families/subscribe",
    name: "ManagerFamiliesSubscribe",
    component: () =>
      import(
        /* webpackChunkName: "ManagerFamiliesSubscribe" */ "../views/ManagerFamiliesSubscribe.vue"
      ),
  },
  {
    path: "/manager/families/list",
    name: "ManagerFamilies",
    component: () =>
      import(
        /* webpackChunkName: "ManagerFamilies" */ "../views/ManagerFamilies.vue"
      ),
  },
  {
    path: "/manager/event/create",
    name: "ManagerEventCreate",
    component: () =>
      import(
        /* webpackChunkName: "ManagerFamiliesSubscribe" */ "../views/ManagerEventCreate.vue"
      ),
  },
  {
    path: "/manager/event/list",
    name: "ManagerEvents",
    component: () =>
      import(
        /* webpackChunkName: "ManagerFamilies" */ "../views/ManagerEvents.vue"
      ),
  }

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
