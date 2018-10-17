import Vue from "vue";
import Router from "vue-router";
import NProgress from "nprogress";

import Login from "./views/Login.vue";
import Dashboard from "./views/Dashboard.vue";
import FilecoinAccess from "./views/FilecoinAccess.vue";
import RegistrationConfirmation from "./views/RegistrationConfirmation.vue";
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
      component: FilecoinAccess
    },
    {
      path: "/registration-confirmation",
      name: "RegistrationConfirmation",
      component: RegistrationConfirmation
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
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
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
