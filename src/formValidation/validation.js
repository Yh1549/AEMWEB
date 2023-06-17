import { useStore } from "../store/store";

export const validation = {
  notNull: function (arg) {
    if (arg == null || arg == undefined) {
      return {
        result: false,
        msg: "請勿空白",
      };
    } else if (arg.length == 0) {
      return {
        result: false,
        msg: "請勿空白",
      };
    } else {
      return {
        result: true,
        msg: "ok",
      };
    }
  },
  fileImageOnly: function (arg) {
    if (arg == null || arg == undefined || arg == "") {
      return {
        result: false,
        msg: "請勿空白3",
      };
    } else {
      return {
        result: true,
        msg: "ok3",
      };
    }
  },
  todayAfter: function (arg) {
    // arg and today example: 20xx-01-01
    // after aplit => [20xx,01,01]
    let today = useStore().getToday().split("-");
    let array = arg.split("-");
    let todayNum = "";
    let arrayNum = "";
    for (let i = 0; i < array.length; i++) {
      todayNum += today[i];
      arrayNum += array[i];
    }
    if (arrayNum < todayNum) {
      return {
        result: false,
        msg: "日期請填寫今日之後",
      };
    }
    return {
      result: true,
      msg: "",
    };
  },
  charMax: function (arg, number) {
    let limit = parseInt(number);
    if (arg.split("").length > limit) {
      return {
        result: false,
        msg: "長度過長",
      };
    } else {
      return {
        result: true,
        msg: "ok",
      };
    }
  },
  charMin: function (arg, number) {
    let limit = parseInt(number);
    if (arg.split("").length < limit) {
      return {
        result: false,
        msg: "長度不足",
      };
    } else {
      return {
        result: true,
        msg: "ok",
      };
    }
  },
  numMixEn: function (arg) {
    let reg = /[a-zA-Z][0-9]|[0-9][a-zA-Z]/g;
    if (reg.test(arg)) {
      return {
        result: true,
        msg: "ok",
      };
    } else {
      return {
        result: false,
        msg: "需要英文數字混和",
      };
    }
  },
  notCn: function (arg) {
    let reg = /[/da-zA-Z]/g;
    let unreg = /[\u4e00-\u9fa5]/g;
    if (reg.test(arg) && !unreg.test(arg)) {
      return {
        result: true,
        msg: "numOrEnok",
      };
    } else {
      return {
        result: false,
        msg: "只能輸入英文或數字",
      };
    }
  },
  cronTimeLastWord: function (time) {
    let reg = /[0-9]/g;
    if (reg.test(time.slice(0, 1))) {
      return {
        result: true,
        msg: "timeok",
      };
    } else {
      return {
        result: false,
        msg: "第一個字只能為數字",
      };
    }
  },
  link: function (arg) {
    let reg =
      /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;
    if (reg.test(arg)) {
      return {
        result: true,
        msg: "timeok",
      };
    } else {
      return {
        result: false,
        msg: "連結格式有誤",
      };
    }
  },
  capital: function (arg) {
    let reg = /[A-Z]/g;
    if (reg.test(arg)) {
      return {
        result: true,
        msg: "ok",
      };
    } else {
      return {
        result: false,
        msg: "大寫英文需要至少1碼",
      };
    }
  },
  onlyNumEn: function (arg) {
    let reg = /^[0-9a-zA-Z]+$/;
    if (reg.test(arg)) {
      return {
        result: true,
        msg: "ok",
      };
    } else {
      return {
        result: false,
        msg: "不可含有特殊字元",
      };
    }
  },
};
