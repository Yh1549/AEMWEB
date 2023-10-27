import { defineStore } from "pinia";
import router from "../router/router.js";
// 非動態資料store
export const useCommonStore = defineStore({
  id: "commomStore",
  state: () => ({
    // 狀態對照
    caseStatus: {
      checking: {
        title: "審核中",
        color: "bg-secondaryDark",
      },
      online: {
        title: "已發布",
        color: "bg-primaryDark",
      },
      hide: {
        title: "已隱藏",
        color: "bg-gray-500",
      },
      offline: {
        title: "已下架",
        color: "bg-gray-500",
      },
      end: {
        title: "已結案",
        color: "bg-gray-200",
      },
      deleted: {
        title: "已否決",
        color: "bg-gray-500",
      },
      unAdvertise: {
        title: "未發布",
        color: "bg-gray-500",
      },
    },
    actionType: {
      create: { title: "建檔", color: "bg-submit" },
      update: { title: "修改", color: "bg-secondaryDark" },
      hide: { title: "隱藏", color: "bg-cancel" },
      recover: { title: "復原", color: "bg-cancel" },
    },
    caseType: {
      POST: { title: "公告", color: "bg-primaryLight" },
      AD: { title: "廣告", color: "bg-secondaryDark" },
    },
    pageItem: {
      approve: {
        approveAll: {
          id: "approveAll",
          path: "/approveAll",
          title: "案件放行",
          auth: "CheckCaseAndRelease",
        },
        approvehistory: {
          id: "approvehistory",
          path: "/approvehistory",
          title: "案件總覽",
          auth: "HistoryCases",
        },
      },
      post: {
        postAll: {
          id: "postAll",
          path: "/postAll",
          title: "公告列表",
          desc: "查看聯邦銀行的所有公告",
          auth: "pass",
        },
        postNew: {
          id: "postNew",
          path: "/postNew",
          title: "新增公告",
          desc: "加入一則新的公告至您指定的系統",
          auth: "CreatePost",
        },
      },
      advertise: {
        advertiseAll: {
          id: "advertiseAll",
          path: "/advertiseAll",
          title: "廣告列表",
          desc: "找到所有的廣告!",
          auth: "pass",
        },
        advertiseNew: {
          id: "advertiseNew",
          path: "/advertiseNew",
          title: "新增廣告",
          desc: "新增廣告",
          auth: "CreateAdvertise",
        },
        advertiseSchedule: {
          id: "advertiseSchedule",
          path: "/advertiseSchedule",
          title: "廣告排序",
          desc: "",
          auth: "UpdateBlockAd",
        },
      },
      admin: {
        UserManage: {
          id: "UserManage",
          path: "/UserManage",
          title: "使用者管理",
          desc: "",
          auth: "SelectAllUser",
        },
        caseflow: {
          id: "caseflow",
          path: "/caseflow",
          title: "審核流程管理",
          desc: "",
          auth: "pass",
        },
        advertiseOption: {
          id: "advertiseOption",
          path: "/advertiseOption",
          title: "廣告選項管理",
          desc: "",
          auth: "pass",
        },
        optionsManage: {
          id: "optionsManage",
          path: "/optionsManage",
          title: "系統選項設定",
          desc: "",
          auth: "CreatePostTag",
        },
        errorCodeManage: {
          id: "errorCodeManage",
          path: "/errorCodeManage",
          title: "錯誤代碼管理",
          desc: "",
          auth: "pass",
        },
        scheduleManage: {
          id: "scheduleManage",
          path: "/scheduleManage",
          title: "作業排程管理",
          desc: "",
          auth: "FindScheduler",
        },
        msgInfoManage: {
          id: "msgInfoManage",
          path: "/msgInfoManage",
          title: "訊息管理",
          desc: "",
          auth: "FindAllMsgInfo",
        },
      },
    },
    apiErrorMsg: "",
    SvcSucess: {
      title: "成功",
      msg: "即將返回上一頁",
    },
    SvcFail: {
      title: "失敗",
      msg: "",
    },
    errorCode: {
      login: [
        "x001",
        "x002",
        "x003",
        "x004",
        "x005",
        "x006",
        "x007",
        "x008",
        "x009",
        "x010",
        "x011",
        "AEE001",
        "AEE002",
        "AEE004",
        "AEE005",
        "AEE006",
        "AEE007",
        "AEE008",
        "AEE011",
        "AMS001",
        "AMS007",
        "AMS002",
        "AEE015",
        "AEE016",
        "AEE017",
      ],
    },
  }),
  getters: {},
  actions: {
    getCaseStatusName(caseStatusCode) {
      for (let item in this.caseStatus) {
        if (item === caseStatusCode) {
          return this.caseStatus[item];
        }
      }
    },
    loginErrorHandle(res) {
      for (let item of this.errorCode.login) {
        if (res.code == item) {
          return true;
        }
      }
      return false;
    },
    tokenRemove() {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userInfo");
      router.push({ name: "Login" });
    },
  },
  //
});
