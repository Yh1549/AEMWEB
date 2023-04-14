import { validation } from "./validation";
const numReg = /[0-9]/g;
export const InputValidation = (validObj, e) => {
  let array = e.target.getAttribute('data-valid-option').split(',');
  let validNum = 0;
  let validArray = [];
  for (let i = 0; i < array.length; i++) {
    for (let validName in validation) {
      if (array[i].includes('(')) {
        const num = array[i].match(numReg)
        for (let y = 0; y < num.length; y++) {
          validNum += num[y] * (Math.pow(10, num.length - (y + 1)))
        }
        const validMethod = array[i].split('(')[0];
        if (validMethod == validName) {
          validArray.push(validation[validName](e.target.value, validNum));
        }
        validNum = 0;
      } else if (array[i] == validName) {
        validArray.push(validation[validName](e.target.value));
      }
    }
    for (let item in validObj) {
      if (item == e.target.name) {
        validObj[item] = validArray;
        // target: e.target.name, 
        break;
      }
    }
  }
}

export const InputValidationContent = (value, validObj, name, e) => {
  let array = e.split(',');
  let validArray = [];
  for (let i = 0; i < array.length; i++) {
    for (let validName in validation) {
      if (array[i] == validName) {
        validArray.push(validation[validName](value));
      }
    }
    for (let item in validObj) {
      if (item == name) {
        validObj[item] = validArray;
        // target: e.target.name, 
        break;
      }
    }
  }

}

export const getInputValidation = (checkitem) => {
  if (checkitem != null) {
    for (let e of checkitem) {
      if (!e.result) {
        return e
      };
    }
    return { result: true, msg: '' };
  } else return { result: true, msg: 'null' };
}