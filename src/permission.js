import router from "./router/router";
import { useStore } from "./store/store";
router.beforeEach(async (to, from, next) => {
  if (to.meta.title != "登入") {
    if (useStore().getLoginStatus) {
      if (to.meta.requiresAuth) {
        if (useStore().getPageAuth(to.name)) {
          useStore().pageRender = [];
          useStore().pageData.pager = [];
          useStore().chosenList = [];
          useStore().checkAll = false;
          next();
        } else {
          next({ name: "noAuth" });
        }
      } else {
        next();
      }
    } else {
      next({ name: "Login" });
    }
  } else {
    next();
  }
});
