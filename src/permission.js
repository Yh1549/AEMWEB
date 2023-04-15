import router from "./router/router";
import { Store } from "./store/store";
import { commonStore } from "./store/commonStore";
import { apiRequest } from "./api/apiRequest";
// router.beforeEach(async (to, from, next) => {
//   if (to.meta.title != '登入') {
//     if (Store().getLoginStatus) {
//       if (to.meta.requiresAuth) {
//         if (Store().getPageAuth(to.name)) {
//           Store().pageRender = [];
//           Store().pageData.pager = [];
//           Store().chosenList = [];
//           Store().checkAll = false;
//           next();
//         } else {
//           next({ name: 'noAuth' })
//         }
//       } else { next() }
//     } else {
//       next({ name: 'Login' })
//     }
//   } else {
//     next()
//   }
// });
