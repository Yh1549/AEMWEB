import { createRouter, createWebHashHistory, useRouter } from "vue-router";
import { Store, postStore } from "../store/store";
import {
  FindAllCaseFlow, findSysList, FindCaseFlowAndDetail, FindScheduler, FindOnePost, findPostTag
} from "../api/service";
import apiRequest from "../api/apiRequest";
import authLayout from "../layout/authLayout.vue";
import dashBoardLayout from "../layout/dashBoardLayout.vue"
export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: { name: 'Login' },
    },
    {
      path: '/auth',
      component: authLayout,
      children: [
        {
          path: "Login",
          name: "Login",
          component: () => import("../views/auth/Login.vue"),
          meta: {
            requiresAuth: false,
            title: "登入",
          },
          beforeEnter: (to, form, next) => {
            if (sessionStorage.getItem('token')) {
              next({
                path: "/Lobby",
              });
            } else next();
          },
        },
        {
          path: "firstLogin",
          name: "firstLogin",
          component: () => import("../views/auth/firstLogin.vue"),
          meta: {
            requiresAuth: false,
            title: "登入",
          },
        },
      ],
    },
    {
      path: "/dashboard",
      component: dashBoardLayout,
      children: [
        // 首頁
        {
          path: "/Lobby",
          name: "Lobby",
          component: () => import("../views/app/Lobby.vue"),
          meta: {
            requiresAuth: false,
            pageClass: "common",
            title: '公告管理系統'
          },
        },
        // Svc成功
        {
          path: "/SvcSucess",
          name: "SvcSucess",
          component: () => import("../views/common/SvcSucess.vue"),
          meta: {
            requiresAuth: false,
            pageClass: "common",
          },
        },
        // Svc失敗
        {
          path: "/SvcFail",
          name: "SvcFail",
          component: () => import("../views/common/SvcFail.vue"),
          meta: {
            requiresAuth: false,
            pageClass: "common",
          },
        },
        {
          path: "/approveAll",
          name: "approveAll",
          component: () => import("../views/app/approve/approveAll.vue"),
          meta: {
            requiresAuth: true,
            pageClass: "approve",
            title: '審核案件'
          },
        },
        {
          path: "/approveDetail/:caseUuid",
          name: "approveDetail",
          component: () => import("../views/app/approve/approveDetail.vue"),
          meta: {
            requiresAuth: true,
            pageClass: "approve",
            title: '審核案件細節'
          },
        },
        {
          path: '/detail/:uuid/category/:category',
          name: 'detail',
          component: () => import("../layout/detail.vue"),
        },
        // 新增公告
        {
          path: "/postNew",
          name: "postNew",
          // redirect: { name: 'postNewWrite' },
          component: () => import("../views/app/post/PostNew.vue"),
          meta: {
            requiresAuth: true,
            pageClass: "post",
            title: '新增公告'
          },
          beforeEnter: async (to, from, next) => {
            postStore().$reset();
            Store().$reset()
            await findSysList();
            next();
          },
        },
        // 所有公告
        {
          path: "/postAll",
          name: "postAll",
          component: () => import("../views/app/post/PostAll.vue"),
          meta: {
            requiresAuth: false,
            pageClass: "post",
            title: '公告列表'
          },
          beforeEnter: (to, from, next) => {
            if (from.name !== "postDetail") {
              Store().searchMemo = {
                keyword: undefined,
                system: undefined,
                startTime: undefined,
                endTime: undefined,
              };
            }
            next()
          }
        },
        // 所有廣告
        {
          path: "/advertiseAll",
          name: "advertiseAll",
          component: () => import("../views/app/ad/adAll.vue"),
          meta: {
            requiresAuth: false,
            pageClass: "advertise",
            title: '廣告列表'
          },
        },
        // 新增廣告
        {
          path: "/advertiseNew",
          name: "advertiseNew",
          component: () => import("../views/app/ad/adNew.vue"),
          meta: {
            requiresAuth: true,
            pageClass: "advertise",
            title: '新增廣告'
          },
        },
        // 廣告排程
        {
          path: "/advertiseSchedule",
          name: "advertiseSchedule",
          component: () => import("../views/app/ad/adSchedule.vue"),
          meta: {
            requiresAuth: true,
            pageClass: "advertise",
            title: '廣告排序'
          },
        },
        // 廣告選項
        {
          path: "/advertiseOption",
          name: "advertiseOption",
          component: () => import("../views/app/ad/adOption.vue"),
          meta: {
            requiresAuth: true,
            pageClass: "advertise",
            title: '廣告選項'
          },
        },
        // *** admin權限管理 ***
        // 錯誤代碼頁
        {
          path: "/errorCodeManage",
          name: "errorCodeManage",
          component: () => import("../views/app/admin/errorCodeManage.vue"),
          meta: {
            requiresAuth: true,
            pageClass: "admin",
            title: '錯誤代碼'
          },
          beforeEnter: async (ro, from, next) => {
            await apiRequest.post('FindSysMsg', {}).then((res) => { Store().sysMsg = res.resBody.sysMsgList }).catch((e) => { });
            next();
          }
        }, {
          path: '/errorCodeNew',
          name: 'errorCodeNew',
          component: () => import('../views/app/admin/errorCodeNew.vue'),
          meta: {
            requiresAuth: true,
            pageClass: "admin",
            title: '新增錯誤代碼'
          },
        },
        // 使用者管理
        {
          path: "/UserManage",
          name: "UserManage",
          component: () => import("../views/app/admin/user/UserManage.vue"),
          meta: {
            requiresAuth: true,
            pageClass: "admin",
            title: '使用者管理'
          },
        },
        // 新增使用者
        {
          path: "/userNew",
          name: "userNew",
          component: () => import("../views/app/admin/user/UserNew.vue"),
          meta: {
            requiresAuth: true,
            pageClass: "admin",
            title: '新增使用者'
          },
        },
        // 編輯使用者
        {
          path: "/userEdit/:userId",
          name: "userEdit",
          redirect: { name: "userBasic" },
          component: () => import("../views/app/admin/user/UserEdit.vue"),
          meta: {
            requiresAuth: true,
            pageClass: "admin",
            title: '編輯使用者'
          },
          children: [
            // 編輯使用者/基本資料
            {
              path: "userBasic",
              name: "userBasic",
              component: () => import("../views/app/admin/user/userEdit/userBasic.vue"),
            },
            // 編輯使用者/權限
            {
              path: "userAuth",
              name: "userAuth",
              component: () => import("../views/app/admin/user/userEdit/userAuth.vue"),
            },
            // 編輯使用者/審核
            {
              path: "userPostFlow",
              name: "userPostFlow",
              component: () => import("../views/app/admin/user/userEdit/userPostFlow.vue"),
            },
            {
              path: "userCaseRole",
              name: "userCaseRole",
              component: () => import("../views/app/admin/user/userEdit/userCaseRole.vue"),
            },
          ],
        },

        // 審核流程管理
        {
          path: "/caseflow",
          name: "caseflow",
          component: () => import("../views/app/admin/Caseflow.vue"),
          meta: {
            requiresAuth: true,
            pageClass: "admin",
            title: '審核流程管理'
          },
          beforeEnter: async (to, form, next) => {
            await FindAllCaseFlow()
            findSysList()
            next();
          },
        },
        // 審核流程細節
        {
          path: "/caseflowDetail/:id",
          name: "caseflowDetail",
          component: () => import("../views/app/admin/CaseFlowDetail.vue"),
          meta: {
            requiresAuth: true,
            pageClass: "admin",
            title: '審核流程細節'
          },
          beforeEnter: (to, form, next) => {
            FindCaseFlowAndDetail(to.params.id)
            next();
          },
        },
        // 新增審核流程
        {
          path: "/caseflowNew",
          name: "caseflowNew",
          component: () => import("../views/app/admin/CaseFlowNew.vue"),
          meta: {
            requiresAuth: true,
            pageClass: "admin",
            title: '新增審核流程'
          },
          beforeEnter: (to, form, next) => {
            FindAllCaseFlow()
            next();
          },
        },
        // // 編輯審核流程 (暫時停用)
        // {
        //   path: "/caseflowEdit/:id",
        //   name: "caseflowEdit",
        //   component: () => import("../views/admin/CaseFlowEdit.vue"),
        //   meta: {
        //     requiresAuth: true,
        //     pageClass: "admin",
        //   },
        // },

        // 公告選項管理
        {
          path: "/optionsManage",
          name: "optionsManage",
          component: () => import("../views/app/admin/OptionsManage.vue"),
          meta: {
            requiresAuth: true,
            pageClass: "admin",
            title: '系統選項管理'
          },
        },
        {
          path: "/scheduleManage",
          name: "scheduleManage",
          component: () => import("../views/app/admin/scheduleManage.vue"),
          meta: {
            requiresAuth: true,
            pageClass: "admin",
            title: '作業排程管理'
          },
          beforeEnter: async (to, from, next) => {
            await FindScheduler();
            next();
          },
        },

        // *** 使用教學 (暫時停用) ***
        // {
        //   path: "/howTo",
        //   name: "howTo",
        //   component: () => import("../views/howTo.vue"),
        // },
        // 個人資訊 (當前使用者)
        {
          path: "/userInfo",
          name: "userInfo",
          component: () => import("../views/app/UserInfo.vue"),
          meta: {
            requiresAuth: false,
            title: "個人資訊",
          },
        },

        // 錯誤處理
        {
          path: "/catchAll(.*)",
          redirect: { name: "404error" },
        },
        {
          path: "/noAuth",
          name: "noAuth",
          component: () => import("../views/common/noAuth.vue"),
        },
        {
          path: "/404error",
          name: "404error",
          component: () => import("../views/common/404Error.vue"),
        },
      ],
    },

  ],
});

// *** 已刪除功能 ***
// 1. 編輯/刪除公告
// 2. 公告草稿匣
// 3. 審核新增/編輯使用者
// 4. 編輯/刪除審核流程
