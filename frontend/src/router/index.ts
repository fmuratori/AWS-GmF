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
    path: "/manager",
    name: "ManagerHome",
    component: () => import(/* webpackChunkName: "ManagerHome" */ "../views/ManagerHome.vue")
  },
  {
    path: "/manager/donations/create",
    name: "ManagerDonationsCreate",
    component: () => import(/* webpackChunkName: "ManagerDonationsCreate" */ "../views/ManagerDonationsCreate.vue")
  },
  {
    path: "/manager/donations/list",
    name: "ManagerDonationsList",
    component: () => import(/* webpackChunkName: "ManagerDonationsList" */ "../views/ManagerDonationsList.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
