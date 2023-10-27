import { validation } from "./validation";
const numReg = /[0-9]/g;

export const InputValidation = (value, validArg) => {
  let result = [];
  validArg.forEach((validItem) => {
    if (validItem.includes("(")) {
      const num = parseInt(validItem.match(numReg).join(""));
      const method = validItem.split("(")[0];
      for (let item in validation) {
        if (method == item) {
          result.push(validation[item](value, num));
        }
      }
    } else {
      for (let item in validation) {
        if (validItem == item) {
          result.push(validation[item](value));
        }
      }
    }
  });

  return result;
};
export const InputValidationContent = (value, validObj, validArg) => {
  if (value != null || value != "") {
    validObj.pass = true;
    validObj.msg = "驗證通過";
  } else {
    validObj.pass = false;
    validObj.msg = "驗證失敗";
  }
};

export const getInputValidation = (checkitem) => {
  if (checkitem != null) {
    for (let e of checkitem) {
      if (!e.result) {
        return e;
      }
    }
    return { result: true, msg: "" };
  } else return { result: true, msg: "null" };
};

export const checkValidList = (obj) => {
  for (let item in obj) {
    if (!obj[item].pass) {
      return false;
    }
  }
  return true;
};
