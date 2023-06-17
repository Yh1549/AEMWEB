import { InputValidation } from "./formValidation/validTunnel";
export const verifySetting = {
  mounted(el, binding, vnode, prevVnode) {
    el.addEventListener("change", () => {
      let result = InputValidation(el.value, binding.arg);
      for (let item of result) {
        if (!item.result) {
          binding.value.pass = false;
          binding.value.msg = item.msg;
          return;
        } else {
          binding.value.pass = true;
          binding.value.msg = "驗證符合";
        }
      }
      if (binding.modifiers.noMsg) {
        binding.value.msg = "";
      }
    });
  },
};
