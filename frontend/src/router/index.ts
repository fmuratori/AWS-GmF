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
    path: "/user/edit",
    name: "ManagerEditUserInfo",
    component: () =>
      import(
        /* webpackChunkName: "ManagerHome" */ "../views/ManagerEditUserInfo.vue"
      ),
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
    path: "/manager/donations/user-list",
    name: "ManagerDonationsUserList",
    component: () =>
      import(
        /* webpackChunkName: "ManagerDonationsUserList" */ "../views/ManagerDonationsUserList.vue"
      ),
  },
  {
    path: "/manager/donations/volunteer-list",
    name: "ManagerDonationsVolunteerList",
    component: () =>
      import(
        /* webpackChunkName: "ManagerDonationsVolunteerList" */ "../views/ManagerDonationsVolunteerList.vue"
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
    path: "/manager/donations/retrieve",
    name: "ManagerDonationsRetrieve",
    component: () =>
      import(
        /* webpackChunkName: "ManagerDonationsRetrieve" */ "../views/ManagerDonationsRetrieve.vue"
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
    path: "/manager/event/create",
    name: "ManagerEventCreate",
    component: () =>
      import(
        /* webpackChunkName: "ManagerEventCreate" */ "../views/ManagerEventCreate.vue"
      ),
  },
  {
    path: "/manager/event/list",
    name: "ManagerEvents",
    component: () =>
      import(
        /* webpackChunkName: "ManagerEvents" */ "../views/ManagerEvents.vue"
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
    name: "ManagerPacks",
    component: () =>
      import(
        /* webpackChunkName: "ManagerPacks" */ "../views/ManagerPacks.vue"
      ),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
