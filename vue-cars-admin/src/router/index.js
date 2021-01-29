import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "../views/Layout"
Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    redirect: "Login",
    hidden: true
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    component: () => import("../views/Login/index.vue")
  },
  {
    path: "/home",
    name: "Home",
    meta: {
      title: "控制台",
      icon: "console",
      iconClass: "icon_console"
    },
    component: Layout,
    children: [
      {
        path: "/consoleIndex",
        name: "ConsoleIndex",
        meta: {
          title: "首页"
        },
        component: () => import("../views/Console/index.vue"),
      }
    ]
  },
  // 停车场
  {
    path: "/parking",
    name: "Parking",
    meta: {
      title: "停车场",
      icon: "console",
      iconClass: "icon_console"
    },
    component: Layout,
    children: [
      {
        path: "/parkingIndex",
        name: "ParkingIndex",
        meta: {
          title: "列表管理"
        },
        component: () => import("../views/Parking/index.vue"),
      },
      {
        path: "/parkingAdd",
        name: "ParkingAdd",
        meta: {
          title: "新增停车场"
        },
        component: () => import("../views/Parking/add.vue"),
      }
    ]
  },
  // 车辆品牌
  {
    path: "/carsBrand",
    name: "CarsBrand",
    meta: {
      title: "车辆品牌",
      icon: "console",
      iconClass: "icon_console"
    },
    component: Layout,
    children: [
      {
        path: "/carsBrandIndex",
        name: "CarsBrandIndex",
        meta: {
          title: "品牌列表"
        },
        component: () => import("../views/carsBrand/index.vue"),
      }
    ]
  },
];

const router = new VueRouter({
  routes
});

export default router;
