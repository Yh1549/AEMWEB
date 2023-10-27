import { defineStore } from "pinia";
import { useCommonStore } from "./commonStore";

// 全域 Store
export const useStore = defineStore({
  id: "Store",
  state: () => ({
    currentUser: () => {
      if (sessionStorage.getItem("userInfo")) {
        return JSON.parse(sessionStorage.getItem("userInfo"));
      } else {
        return "error";
      }
    },
    // pagecontrol
    // 過濾後的資料進pageRender
    pageRender: [],
    pageSizeOptions: [20, 30, 40],
    pageData: {
      pager: [],
      pageSize: 20,
      totalPages: 1,
      pageCurrent: 1,
    },
    // 公告搜尋優化：查看細節後返回列表，保持上次搜尋紀錄
    searchMemo: {
      personalPost: false,
      keyword: undefined,
      system: undefined,
      startTime: undefined,
      endTime: undefined,
    },
    // 廣告系統版位選擇優化：查看細節後返回列表，保持上次選擇紀錄
    adBlockMemo: {
      system: null,
      block: null,
    },
    // 切換分頁
    tabCurrent: "all",
    tabList: [],
    // 一鍵掃蕩
    chosenList: [],
    checkAll: false,
    //alert
    alertShow: false,
    alertObj: {
      msg: "",
      func: () => {},
    },
    //通知
    noticeLight: [],
    // 單位,系統,群組
    postOption: {
      Unit: [],
      System: [],
      Tag: [],
    },
    changePWShow: false,
    // 錯誤代碼
    sysMsg: [],
    //排程
    scheduleList: [],
    scheduleHistory: [],
    jobList: [],
    //訊息維護
    msgInfoList: [],
    loadingSpinner: false,
    // validationResultObj: {},
    scheduleCheckList: {
      jobName: null,
      triggerName: null,
      triggerGroup: null,
      cronTime: null,
      triggerFlag: null,
    },
    scheduleCheckTime: { tiggerTime: null },
    reSendButton: false,
    firstOtpShow: false,
    resetLogin: false,
    menuToggle: false,
    approveCase: [],
    approveSign: true,
    approveDetail: [],
    originalDetail: [],
    caseSign: [],
    routerPush: null,
    detailinfo: {},
    detailUpdateToggle: false,
    noCheckingCase: false,
  }),
  getters: {
    getLoginStatus() {
      if (sessionStorage.getItem("token")) {
        return true;
      } else {
        return false;
      }
    },
  },
  actions: {
    // 登入者若有此service會回傳true
    getSvcAuth(SvcCheck) {
      if (SvcCheck != "pass") {
        if (this.currentUser().authority) {
          return this.currentUser().authority.some(
            (Svc) => Svc.svcname == SvcCheck
          );
        } else false;
      } else {
        return true;
      }
    },
    getUserRole() {
      return this.currentUser().role;
    },
    // 取得頁面資訊(有權限過濾) function(頁面分類,頁面名) 只輸入分類會回傳一整個分類
    getPageInfo(postTag, pagename) {
      let userPage = [];
      for (let value in useCommonStore().pageItem) {
        if (value === postTag) {
          for (let item in useCommonStore().pageItem[value]) {
            if (this.getSvcAuth(useCommonStore().pageItem[value][item].auth)) {
              userPage.push(useCommonStore().pageItem[value][item]);
            }
            if (pagename) {
              if (item === pagename) {
                return useCommonStore().pageItem[value][item];
              }
            }
          }
        }
      }
      return userPage;
    },
    getPageAuth(pageName) {
      if (pageName != "pass") {
        for (let item in useCommonStore().pageItem) {
          for (let page in useCommonStore().pageItem[item]) {
            if (useCommonStore().pageItem[item][page].id === pageName) {
              return this.getSvcAuth(
                useCommonStore().pageItem[item][page].auth
              );
            }
          }
        }
        return true;
      } else {
        return true;
      }
    },
    getDeptTabPage(e) {
      this.tabCurrent = "all";
      this.tabList = [];
      if (e != null) {
        if (e.target.value && e.target.value !== "all") {
          this.tabCurrent = e.target.value;
          this.pageData.pageCurrent = 1;
          for (let item of useStore().postOption.Unit) {
            if (this.tabCurrent === item.name) {
              for (let user of useUserStore().List) {
                if (user.deptcode == item.code) {
                  this.tabList.push(user);
                }
              }
            }
          }
          this.pageRender = this.tabList;
        } else {
          this.tabCurrent = "all";
          this.pageRender = useUserStore().List;
        }
      } else {
        this.pageRender = useUserStore().List;
      }
    },
    getDeptTabList() {
      let tabSet = new Set();
      for (let item of this.postOption.Unit) {
        tabSet.add(item.name);
      }
      return tabSet;
    },
    getDeptName(deptcode) {
      for (let item of this.postOption.Unit) {
        if (deptcode === item.code) {
          return item;
        }
      }
    },
    getSvc(svcName) {
      for (let item of useUserStore().svcListAll) {
        if (svcName === item.svcName) {
          return item;
        }
      }
    },
    getRelSys(str) {
      for (let i = 0; i < useStore().postOption.System.length; i++) {
        if (str === useStore().postOption.System[i].name) {
          return useStore().postOption.System[i];
        }
      }
      return {
        name: "",
        memo: "",
      };
    },
    getTag(str) {
      for (let i = 0; i < useStore().postOption.Tag.length; i++) {
        if (str == useStore().postOption.Tag[i].name) {
          return useStore().postOption.Tag[i].memo;
        }
      }
    },
    getToday() {
      let today = new Date();
      let d = today.getDate();
      let m = today.getMonth() + 1;
      if (m < 10) {
        m = `0` + m;
      }
      if (d < 10) {
        d = `0` + d;
      }
      let y = today.getFullYear();
      let value = y + "-" + m + "-" + d;
      return value;
    },
    getTomorrow() {
      let today = new Date();
      let d = today.getDate() + 1;
      let m = today.getMonth() + 1;
      if (m < 10) {
        m = `0` + m;
      }
      if (d < 10) {
        d = `0` + d;
      }
      let y = today.getFullYear();
      let value = y + "-" + m + "-" + d;
      return value;
    },
    dateReform(date, seprate, origin) {
      let array;
      if (date) {
        if (origin) {
          array = date.split(`${origin}`);
        } else {
          array = date.split(`-`);
        }
        if (seprate) {
          return array.join(`${seprate}`);
        }
        return array.join(".");
      } else {
        return null;
      }
    },
    timeReform(time) {
      if (time) {
        let array = time.split(" ");
        return array;
      } else {
        return [null];
      }
    },
  },
});
// 公告
export const usePostStore = defineStore({
  id: "postStore",
  state: () => ({
    List: [],
    postDetail: [],
    refId: "",
    postOptionControl: {
      postUnit: [],
      postSystem: [],
    },
    postLog: [],
    totalLevel: "",
    // 審核公告分頁頁籤
    postApproveTabs: [
      {
        status: "checking",
        memo: "審核中",
      },
      {
        status: "deleted",
        memo: "已刪除",
      },
      { status: "end", memo: "已結案" },
    ],
    historyCase: false,
  }),
  // actions: {
  //   getRelSys(Post, str) {
  //     for (let i = 0; i < useStore().postOption.System.length; i++) {
  //       if (Post.relSys === useStore().postOption.System[i].name) {
  //         return useStore().postOption.System[i][str];
  //       }
  //     }
  //   },
  //   getTag(Post, str) {
  //     if (Post != null) {
  //       for (let i = 0; i < useStore().postOption.Tag.length; i++) {
  //         if (Post === useStore().postOption.Tag[i].name) {
  //           return useStore().postOption.Tag[i][str];
  //         }
  //       }
  //     }
  //   },
  // },
});
// 廣告
export const useAdStore = defineStore({
  id: "adStore",
  state: () => ({
    List: [],
    selected: null,
    adBlockList: [],
    selectedSys: null,
    selectedBlock: null,
    updateAdShow: false,
  }),
});
// 使用者
export const useUserStore = defineStore({
  id: "userStore",
  state: () => ({
    List: [],
    userEdit: {},
    userCurrentUpdate: null,
    userUpdateToggle: false,
    userModify: {
      empid: "",
    },
    svcListAll: [],
    svcRoleSet: [],
    setUpdate: {
      authroity: [],
      name: "",
      userset: "",
    },
    caseFlow: null,
    userRoleList: [],
    userRangeAll: [],
    userRangeValid: false,
    userEditCheck: {
      check: null,
    },
    mimaDoubleCheck: null,
  }),
});
// 流程
export const useFlowStore = defineStore({
  id: "flowStore",
  state: () => ({
    caseflow: [],
    caseDetail: {},
  }),
});
