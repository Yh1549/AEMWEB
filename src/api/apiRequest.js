import axios from "axios";
import router from "../router/router.js";
import { useCommonStore } from "../store/commonStore";
import { useStore } from "../store/store";
export const apiRequest = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
// 添加請求攔截器  global
apiRequest.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] =
      "Bearer " + sessionStorage.getItem("token");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
//response
apiRequest.interceptors.response.use(
  async (res) => {
    if (res.data.desc != "successful") {
      if (useCommonStore().loginErrorHandle(res.data)) {
        useStore().alertShow = true;
        useStore(0).alertObj = {
          msg: `錯誤，${res.data.desc}`,
          func: (e) => {
            useCommonStore().tokenRemove();
          },
        };
      }
      return res.data;
    } else {
      if (res.headers["token"]) {
        sessionStorage.setItem("token", res.headers["token"]);
      }
      return res.data;
    }
  },
  function (error) {
    /********************************************
     * HTTP錯誤處理 start
     *********************************************/
    if (error.message == "timeout of 3000ms exceeded") {
      useStore().alertShow = true;
      useStore().alertShow = {
        msg: `連線超時，請稍後在試`,
        func: (e) => {},
      };
      console.log("連線超時");
    }
    if (error.response) {
      switch (error.response.status) {
        case 404:
          router.push({ name: "404error" });
          useCommonStore.apiErrorMsg = "你要找的頁面不存在";
          console.log("404：Not Found 你要找的頁面不存在");
          break;
        case 500:
          router.push({ name: "404error" });
          useCommonStore.apiErrorMsg = "Internal Server Error";
          console.log("500：Internal Server Error 程式發生問題");
          break;
        case 502:
          router.push({ name: "404error" });
          useCommonStore.apiErrorMsg = "Bad Gateway";
          console.log("502：Bad Gateway 上游伺服器接收到無效的回應");
          break;
        case 504:
          router.push({ name: "404error" });
          useCommonStore().apiErrorMsg = "Gateway Timeout";
          console.log(
            "504：Gateway Timeout 未能及時從上游伺服器或者輔助伺服器收到回應"
          );
          break;
        case 200:
          console.log("ERROR 200");
          break;
        default:
          router.push({ name: "404error" });
          console.log(error.message);
      }
    }
    /********************************************
     * HTTP錯誤處理 end
     *********************************************/
    /********************************************
     * 使用者網路斷線 start
     *********************************************/
    if (!window.navigator.onLine) {
      alert("網路出了點問題，請重新連線後重整網頁");
      return;
    }
    /********************************************
     * 使用者網路斷線 end
     *********************************************/
    return Promise.reject(error);
  }
);
export default apiRequest;
