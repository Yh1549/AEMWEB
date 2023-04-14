import apiRequest from "./apiRequest";
import {
  Store,
  userStore,
  flowStore,
  postStore,
} from "../store/store";
import router from "../router/router";
// *** User --start-- ***
// 查詢所有svcschema
export const SelectSvcSchema = async () => {
  await apiRequest.post('SelectSvcSchema', {}).then((res) => {
    userStore().svcListAll = res.resBody.svcSchema;
  }).catch()
}
// 查詢所有使用者
export const SelectAllUser = async () => {
  return await apiRequest.post("SelectAllUser", {})
};
// 查詢選定使用者資料
export const SelectAboutUser = async (empid) => {
  return await apiRequest.post("SelectAboutUser", { empid: empid })
};

// 修改使用者資料
export const UpdateUser = async (updateInfo) => {
  return await apiRequest.post('UpdateUser', updateInfo)
}
export const checkRangeValid = async () => {
  return await apiRequest.post('CheckRangeValid', {})
}
//登出
export const UserLogout = async () => {
  await apiRequest.post("UserLogout", {}).then((res) => {
    sessionStorage.removeItem("token");
  }).catch();
}
// 修改使用者個人的密碼
export const UpdateUserMiMa = async (premima, newmima) => {
  return await apiRequest.post("UpdateUserMiMa", { premima, newmima })
};

// *** User --end-- ***
// *** Post --start-- ***

// 取得所有公告
export const FindPost = async () => {
  return await apiRequest.post("FindPost", {}).then((res) => {
    if (res.desc == 'successful') {
      postStore().List = res.resBody.postModelList;
    } else {
      Store().alertShow = true;
      Store().alertObj = {
        msg: '查無公告',
        func: (e) => { }
      }
    }
  }).catch();
};
// 查詢單筆公告(個人 & 所有公告)
export const FindOnePost = async (uuid) => {
  return await apiRequest.post("FindOnePost", { uuid })
};
// 顯示通過審核簽章（公告用）
export const ShowCaseSignMsgForOnePost = async (refId) => {
  await apiRequest
    .post("ShowCaseSignMsgForOnePost", { refId })
    .then((res) => {
      postStore().postSign = res.resBody.signList;
    })
    .catch();
};
// 顯示審核角色對按鍵操作歷程
export const FindCaseSignMsgLog = async (caseUuid) => {
  await apiRequest.post("FindCaseSignMsgLog", { caseUuid }).then((res) => {
    if (res.desc == 'successful') {
      postStore().postLog = res.resBody.logList;
      postStore().totalLevel = res.resBody.totalLevel;
      Store().caseSign = res.resBody.logList;
    } else {
      Store().alertShow = true;
      Store().alertObj = {
        msg: '查無案件簽章歷程',
        func: (e) => { }
      }
    }
  }).catch();
};

// 關聯系統選項
export const findSysList = async () => {
  if (sessionStorage.getItem('SysList')) {
    Store().postOption.System = JSON.parse(sessionStorage.getItem('SysList'));
  } else {
    await apiRequest.post("FindSysList", {}).then((res) => {
      if (res.desc == 'successful') {
        sessionStorage.setItem('SysList', JSON.stringify(res.resBody.sysModelList))
        Store().postOption.System = res.resBody.sysModelList
      } else {
        Store().alertShow = true;
        Store().alertObj = {
          msg: '查無系統清單',
          func: (e) => { }
        }
      }
    }).catch();
  }
}
export const createSysList = async ({ name, memo }) => {
  return await apiRequest.post("CreateSysList", {
    name,
    memo
  })
}
export const updateSysList = async ({ oldName, name, memo }) => {
  return await apiRequest.post("UpdateSysList", {
    oldName,
    name,
    memo
  })
}
export const deleteSysList = async ({ name }) => {
  return await apiRequest.post("DeleteSysList", { name })
}
// 關聯系統群組選項
export const findPostTag = async (system) => {
  await apiRequest.post('FindPostTag', { system }).then((res) => {
    if (res.desc == 'successful') {
      Store().postOption.Tag = res.resBody.tagModelList
    } else {
      Store().alertShow = true;
      Store().alertObj = {
        msg: '查無類別群組',
        func: (e) => { }
      }
    }
  }).catch();
}
export const createPostTag = async ({ system, name, memo }) => {
  return await apiRequest.post("CreatePostTag", {
    system,
    name,
    memo
  })
}
export const updatePostTag = async ({ system, oldName, name, memo }) => {
  return await apiRequest.post("UpdatePostTag", {
    system,
    oldName,
    name,
    memo
  })
}
export const deletePostTag = async ({ system, name }) => {
  return await apiRequest.post("DeletePostTag", {
    system,
    name
  })
}
// *** Post --end-- ***

// *** Case --start-- ***
export const FindEmpCaseFlowForCaseCreate = async (type, sys) => {
  return await apiRequest.post("FindCreateCaseFlow", {
    relSys: sys, type: type
  })
};
//案件明細
export const CaseDetail = async (arg) => {
  return await apiRequest.post("CaseDetail", { caseUuid: arg });
}
// 審核清單完整版
export const NoticeForRole = () => {
  return apiRequest.post("NoticeForRole", {})
}
// 輕量版待審核案件
export const NoticeForRoleLightVer = () => {
  return apiRequest.post("NoticeForRoleLightVer", {})
};

export const HistoryCases = async () => {
  await apiRequest.post("HistoryCases", { type: "POST" }).then((res) => {
    if (res.desc == 'successful') {
      postStore().List = res.resBody.caseList;
    } else {
      Store().alertShow = true;
      Store().alertObj = {
        msg: '查無歷史案件',
        func: (e) => { }
      }
    }
  }).catch();
}

export const ShowCaseSignMsgForCaseDetail = async (caseUuid) => {
  return await apiRequest.post('ShowCaseSignMsgForCaseDetail', { caseUuid })
}
// 查詢所有審核流程與流程細節
export const FindAllCaseFlowAndDetail = async () => {
  // if (flowStore().caseflow.length == 0) {
  await apiRequest.post("FindAllCaseFlowAndDetail", {}).then((res) => {
    flowStore().caseflow = res.resBody.flowList;
  });
  // }
};
// 新增審核流程
export const CreateCaseFlowAndDetail = async (flow) => {
  return await apiRequest
    .post("CreateCaseFlowAndDetail", {
      memo: flow.memo,
      totalLevel: flow.totalLevel,
      type: flow.type,
      relSys: flow.relSys,
      detailList: flow.detailList,
    })
};
// 查詢所有審核流程
export const FindAllCaseFlow = async () => {
  await apiRequest.post("FindAllCaseFlow", {}).then((res) => {
    flowStore().caseflow = res.resBody.flowList;
  });
};

// 查詢使用者的所有案件流程
export const FindEmpCaseFlowForEdit = async (arg) => {
  if (userStore().caseFlow == null) {
    await apiRequest.post("FindEmpCaseFlowForEdit", { empId: arg }).then((res) => {
      userStore().caseFlow = res.resBody.userCaseFlowList;
    });
  }

};
// 查詢指定審核流程與流程細節
export const FindCaseFlowAndDetail = async (flow) => {
  await apiRequest.post('FindCaseFlowAndDetail', { flow }).then((res) => {
    flowStore().caseDetail = res.resBody
  }).catch((e) => { })
}
// 查詢使用者現有的角色
export const FindEmpCaseRole = async (empId) => {
  return await apiRequest.post('FindEmpCaseRole', { empId })
}
// 檢查是否有審核中的案件
export const CheckCheckingCase = async (refId) => {
  return await apiRequest.post('CheckCheckingCase', { refId })
}
// *** Case --end-- ***

// *** Dept --start--***
export const SelectDept = async () => {
  if (sessionStorage.getItem('deptList')) {
    Store().postOption.Unit = JSON.parse(sessionStorage.getItem('deptList'))
  } else {
    await apiRequest.post('SelectDept', {}).then((res) => {
      if (res.desc == 'successful') {
        sessionStorage.setItem('deptList', JSON.stringify(res.resBody.deptList));
        Store().postOption.Unit = res.resBody.deptList
      } else {
        Store().alertShow = true;
        Store().alertObj = {
          msg: '查無部門單位',
          func: (e) => { }
        }
      }
    }).catch();
  }
}
export const createDept = async ({ code, name, unit }) => {
  return await apiRequest.post("CreateDept", {
    code,
    name,
    unit,
  })
}
export const updateDept = async ({ origin, code, name, unit, memo }) => {
  return await apiRequest.post("UpdateDept", {
    origin,
    code,
    name,
    unit,
    memo
  })
}
export const deleteDept = async ({ code }) => {
  return await apiRequest.post("DeleteDept", { code })
}
// *** Dept --end--***
//*** SysMag --start--***
export const UpdateSysMsg = async (originMsgType,
  originCode,
  msgType,
  code,
  desc,
  memo) => {
  return await apiRequest
    .post("UpdateSysMsg", {
      originMsgType,
      originCode,
      msgType,
      code,
      desc,
      memo
    })
}
export const ReloadSysMsg = async () => {
  return await apiRequest
    .post("ReloadSysMsg", {})
}
export const DeleteSysMsg = async (msgType, code) => {
  return await apiRequest
    .post("DeleteSysMsg", { msgType, code })
}
export const CreateSysMsg = async (msgType, code, desc, memo) => {
  return await apiRequest
    .post("CreateSysMsg", { msgType, code, desc, memo })
}

// *** SysMag --end--***
//*** schedule --start--***
export const UpdateStatus = async (triggerName, status) => {
  return await apiRequest
    .post("UpdateStatus", { triggerName, status })
}
export const UpdateCronTime = async (triggerName, cronTime) => {
  return await apiRequest
    .post("UpdateCronTime", { triggerName, cronTime })
}
export const UpdateMemo = async (triggerName, memo) => {
  return await apiRequest
    .post("UpdateMemo", { triggerName, memo })
}
export const ReFireJob = async (job) => {
  return await apiRequest.post("ReFireJob", { job })
}
export const FindScheduler = async () => {
  await apiRequest
    .post("FindScheduler", {})
    .then((res) => {
      Store().scheduleList = res.resBody.scheduleInfoList;
    })
    .catch();
}
export const FindJob = async () => {
  await apiRequest
    .post("FindJob", {})
    .then((res) => {
      Store().jobList = res.resBody.jobModelLists;
    })
    .catch();
}
export const FindHistoryFireJob = async (jobName) => {
  await apiRequest
    .post("FindHistoryFireJob", { jobName })
    .then((res) => {
      Store().scheduleHistory = res.resBody.jobModelLists;
    })
    .catch();
}
export const DeleteTrigger = async (triggerName) => {
  return await apiRequest
    .post("DeleteTrigger", { triggerName })

}
export const DeleteJob = async (jobName) => {
  return await apiRequest
    .post("DeleteJob", { jobName })

}
export const CreateSchedule = async (jobName, jobData, triggerName, triggerGroup, cronTime, triggerFlag, memo) => {
  return await apiRequest
    .post("CreateSchedule", { jobName, jobData, triggerName, triggerGroup, cronTime, triggerFlag, memo })

}
// *** schedule --end--***