import { defineStore } from "pinia";
import { commonStore } from "./commonStore";

// 全域 Store
export const Store = defineStore({
  id: "Store",
  state: () => ({
    currentUser: () => {
      if (sessionStorage.getItem('userInfo')) {
        return JSON.parse(sessionStorage.getItem('userInfo'));
      } else {
        return 'error';
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
      block: null
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
      msg: '',
      func: () => { },
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
    // 仔入中
    loadingSpinner: false,
    validationResultObj: {},
    currentNewStep: '',
    scheduleCheckList: {
      jobName: null,
      triggerName: null,
      triggerGroup: null,
      cronTime: null,
      triggerFlag: null,
    },
    scheduleCheckTime: { tiggerTime: null },
    caseFlowCheck: {
      relSys: null,
      type: null,
      totalLevel: null,
      memo: null,
    },
    errorCodeCheck: {
      msgType: [{ result: true, msg: 'null' }],
      code: [{ result: true, msg: 'null' }],
      desc: [{ result: true, msg: 'null' }],
    },
    changePWList: {
      oldPw: null,
      newPw: null,
      checkPw: null,
    },
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
      if (sessionStorage.getItem('token')) {
        return true;
      } else { return false }
    },
  },
  actions: {
    // 登入者若有此service會回傳true
    getSvcAuth(SvcCheck) {
      if (SvcCheck != 'pass') {
        if (this.currentUser().authority) {
          return this.currentUser().authority.some((Svc) => Svc.svcname == SvcCheck);
        } else false
      } else {
        return true
      }
    },
    getUserRole() {
      return this.currentUser().role;
    },
    // 取得頁面資訊(有權限過濾) function(頁面分類,頁面名) 只輸入分類會回傳一整個分類
    getPageInfo(postTag, pagename) {
      let userPage = [];
      for (let value in commonStore().pageItem) {
        if (value === postTag) {
          for (let item in commonStore().pageItem[value]) {
            if (this.getSvcAuth(commonStore().pageItem[value][item].auth)) {
              userPage.push(commonStore().pageItem[value][item])
            }
            if (pagename) {
              if (item === pagename) {
                return commonStore().pageItem[value][item];
              }
            }
          }
        }
      } return userPage;
    },
    getPageAuth(pageName) {
      if (pageName != 'pass') {
        for (let item in commonStore().pageItem) {
          for (let page in commonStore().pageItem[item]) {
            if (commonStore().pageItem[item][page].id === pageName) {
              return this.getSvcAuth(commonStore().pageItem[item][page].auth)
            }
          }
        } return true
      } else { return true }

    },
    getDeptTabPage(e) {
      this.tabCurrent = "all";
      this.tabList = [];
      if (e != null) {
        if (e.target.value && e.target.value !== "all") {
          this.tabCurrent = e.target.value;
          this.pageData.pageCurrent = 1;
          for (let item of Store().postOption.Unit) {
            if (this.tabCurrent === item.name) {
              for (let user of userStore().List) {
                if (user.deptcode == item.code) {
                  this.tabList.push(user)
                }
              };
            }
          }
          this.pageRender = this.tabList;
        } else {
          this.tabCurrent = "all";
          this.pageRender = userStore().List;
        }
      } else {
        this.pageRender = userStore().List;
      }
    },
    getDeptTabList() {
      let tabSet = new Set();
      for (let item of this.postOption.Unit) {
        tabSet.add(item.name)
      }
      return tabSet;
    },
    getDeptName(deptcode) {
      for (let item of this.postOption.Unit) {
        if (deptcode === item.code) {
          return item
        }
      }
    },
    getSvc(svcName) {
      for (let item of userStore().svcListAll) {
        if (svcName === item.svcName) {
          return item
        }
      }
    },
    getRelSys(str) {
      for (let i = 0; i < Store().postOption.System.length; i++) {
        if (str === Store().postOption.System[i].name) {
          return Store().postOption.System[i].memo
        }
      }
    },
    getTag(str) {
      for (let i = 0; i < Store().postOption.Tag.length; i++) {
        if (str == Store().postOption.Tag[i].name) {
          return Store().postOption.Tag[i].memo
        }
      }
    },
    getRoleName(rolecode) {
      let obj;
      for (let item of flowStore().caseflow) {
        for (let value of item.detailList)
          if (rolecode == value.role) {
            obj = {
              total: item,
              detail: value
            }
            return obj;
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
      let array
      if (date) {
        if (origin) {
          array = date.split(`${origin}`);
        } else {
          array = date.split(`-`);
        };
        if (seprate) {
          return array.join(`${seprate}`);
        }
        return array.join(".");
      } else {
        return null
      }
    },
    timeReform(time) {
      if (time) {
        let array = time.split(" ");
        return array;
      } else {
        return [null]
      }
    },
  },

});
// 公告
export const postStore = defineStore({
  id: "postStore",
  state: () => ({
    List: [],
    postDetail: [],
    refId: '',
    postOptionControl: {
      postUnit: [],
      postSystem: [],
    },
    postLog: [],
    totalLevel: '',
    // 審核公告分頁頁籤
    postApproveTabs: [{
      status: 'checking',
      memo: '審核中'
    }, {
      status: 'deleted',
      memo: '已刪除',
    }, { status: 'end', memo: '已結案' }],
    // 新增公告
    newPost: {
      title: null,
      content: null,
      top: '1',
      postDate: null,
      relSys: null,
      tag: null,
      // Unit: null,
      flow: null,
    },
    newPostCheckList: {
      flow: null,
      // top: true,
      // Unit: true,
      postDate: null,
      title: null,
      content: null,
      relSys: null,
    },
    postUpdate: {
      uuid: null,
      title: null,
      content: null,
      top: null,
      tag: null,
    },
    postUpdateCheckList: {
      title: [{
        result: true,
        msg: ''
      }],
      content: [{
        result: true,
        msg: ''
      }],
      top: [{
        result: true,
        msg: ''
      }],
      tag: [{
        result: true,
        msg: ''
      }],
    },
    historyCase: false,
  }),
  actions: {
    getCaseflow(str) {
      if (this.newPost.flow != null) {
        for (let i = 0; i < flowStore().caseDetail.length; i++) {
          if (this.newPost.flow === flowStore().caseDetail[i].flow) {
            return flowStore().Detail[i][str];
          }
        }
      } else {
        return false
      }
    },
    getRelSys(str) {
      if (this.newPost.relSys != null) {
        for (let i = 0; i < Store().postOption.System.length; i++) {
          if (this.newPost.relSys === Store().postOption.System[i].name) {
            return Store().postOption.System[i][str]
          }
        }
      } else return false
    },
    getTag(str) {
      if (this.newPost.tag != null) {
        for (let i = 0; i < Store().postOption.Tag.length; i++) {
          if (this.newPost.tag === Store().postOption.Tag[i].name) {
            return Store().postOption.Tag[i][str]
          }
        }
      }
    },
  },
});
// 廣告
export const adStore = defineStore({
  id: 'adStore',
  state: () => ({
    List: [],
    selected: null,
    adBlockList: [],
    newAd: {
      title: null,
      content: null,
      startDate: null,
      endDate: "2099-01-01",
      system: null,
      photo: null,
      link: null,
      block: null,
      flow: null,
    },
    newAdCheckList: {
      flow: null,
      title: null,
      content: null,
      startDate: null,
      // endDate: null,
      system: null,
      // link: null,
      block: null,
    },
    updateAdShow: false,
    updateModify: {
      uuid: "",
      title: "",
      content: "",
      startDate: "",
      endDate: "",
      photo: "",
      link: "",
      block: "",
    },
    updateModifyValid: {
      title: null,
      content: null,
      startDate: null,
      endDate: null,
      photo: null,
      link: null,
    },
  }),
  actions: {
    getBlockMemo(str) {
      for (let i = 0; i < this.adBlockList.length; i++) {
        if (str === this.adBlockList[i].block) {
          return this.adBlockList[i].memo
        }
      }
    },
    getCaseflow(str) {
      if (this.newAd.flow != null) {
        for (let i = 0; i < flowStore().caseDetail.length; i++) {
          if (this.newAd.flow === flowStore().caseDetail[i].flow) {
            return flowStore().Detail[i][str];
          }
        }
      } else {
        return false
      }
    },
    getRelSys(str) {
      if (this.newAd.relSys != null) {
        for (let i = 0; i < Store().postOption.System.length; i++) {
          if (this.newAd.relSys === Store().postOption.System[i].name) {
            return Store().postOption.System[i][str]
          }
        }
      } else return false
    },
    getTag(str) {
      if (this.newAd.tag != null) {
        for (let i = 0; i < Store().postOption.Tag.length; i++) {
          if (this.newAd.tag === Store().postOption.Tag[i].name) {
            return Store().postOption.Tag[i][str]
          }
        }
      }
    },
  },
})
// 使用者
export const userStore = defineStore({
  id: "userStore",
  state: () => ({
    List: [],
    UserSvcListTabs: [{
      name: "全部",
      tag: 'all'
    }, {
      name: "公告",
      tag: 'post'
    }, {
      name: "審核",
      tag: 'Case'
    }, {
      name: "使用者", tag: 'User'
    }, {
      name: "部門", tag: 'Dept'
    }, {
      name: '廣告', tag: 'advertise'
    }, {
      name: '排程', tag: 'schedule'
    }, {
      name: '錯誤代碼', tag: 'SysMsg'
    }, {
      name: '其他', tag: null
    }],
    userEdit: {},
    userCurrentUpdate: null,
    userUpdateToggle: false,
    userModify: {
      empid: '',
    },
    svcListAll: [],
    svcRoleSet: [],
    setUpdate: {
      authroity: [],
      name: '',
      userset: ''
    },
    caseFlow: null,
    userRoleList: [],
    userRangeAll: [],
    userRangeValid: false,
    newUser: {
      name: null,
      empid: null,
      mima: null,
      memo: null,
      deptcode: null,
      // email: null,
      title: null,
      authority: [],
      range: [],
    },
    // 驗證list
    newUserCheckList: {
      name: null,
      empid: null,
      mima: null,
      mimaDouble: null,
      deptcode: null,
      // email: null,
      // memo: null
    },
    userEditCheck: {
      check: null
    },
    mimaDoubleCheck: null,
  }),
});
// 流程
export const flowStore = defineStore({
  id: "flowStore",
  state: () => ({
    caseflow: [],
    caseDetail: {},
  }),
});