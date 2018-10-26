import Vue from "vue";
import Router from "vue-router";
import NProgress from "nprogress";

import Login from "./views/Login.vue";
import Dashboard from "./views/Dashboard.vue";
import InviteDetail from "./views/InviteDetail.vue";

import store from "./store";

Vue.use(Router);

const checkLogin = (to, from, next) => {
  const re = /^\w*@protocol\.ai$/;
  const email = store.state.user.email;
  if (re.test(email)) {
    next();
  } else {
    next(`/login${to.path ? `?redirect=${to.path}` : ""}`);
  }
};

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/filecoin-invite/:token",
      name: "FilecoinAccess",
      component: () => import("./views/FilecoinAccess.vue")
    },
    {
      path: "/registration-confirmation",
      name: "RegistrationConfirmation",
      component: () => import("./views/RegistrationConfirmation.vue")
    },
    {
      path: "/login",
      alias: "/",
      name: "Login",
      component: Login
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard,
      beforeEnter: checkLogin
    },
    {
      path: "/manage-invites",
      name: "ManageFilecoinInvites",
      component: () =>
        import(/* webpackChunkName: "managefilecoininvites" */ "./views/ManageFilecoinInvites.vue"),
      beforeEnter: checkLogin
    },
    {
      path: "/manage-invites/:id",
      name: "InviteDetail",
      component: InviteDetail,
      beforeEnter: checkLogin
    }
  ]
});

router.beforeResolve((to, from, next) => {
  if (to.name) NProgress.start();
  next();
});

router.afterEach((to, from) => {
  NProgress.done();
});

export default router;
