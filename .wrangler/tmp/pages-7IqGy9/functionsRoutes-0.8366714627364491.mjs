import { onRequestPost as __api_admin_js_onRequestPost } from "C:\\Users\\HP\\rattan-cf\\functions\\api\\admin.js"
import { onRequestGet as __api_data_js_onRequestGet } from "C:\\Users\\HP\\rattan-cf\\functions\\api\\data.js"
import { onRequestGet as __api_img_js_onRequestGet } from "C:\\Users\\HP\\rattan-cf\\functions\\api\\img.js"
import { onRequestGet as __api_instagram_js_onRequestGet } from "C:\\Users\\HP\\rattan-cf\\functions\\api\\instagram.js"
import { onRequestPost as __api_pay_js_onRequestPost } from "C:\\Users\\HP\\rattan-cf\\functions\\api\\pay.js"
import { onRequestPost as __api_pay_callback_js_onRequestPost } from "C:\\Users\\HP\\rattan-cf\\functions\\api\\pay-callback.js"
import { onRequestGet as __api_pay_status_js_onRequestGet } from "C:\\Users\\HP\\rattan-cf\\functions\\api\\pay-status.js"
import { onRequestPost as __api_track_js_onRequestPost } from "C:\\Users\\HP\\rattan-cf\\functions\\api\\track.js"

export const routes = [
    {
      routePath: "/api/admin",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_js_onRequestPost],
    },
  {
      routePath: "/api/data",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_data_js_onRequestGet],
    },
  {
      routePath: "/api/img",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_img_js_onRequestGet],
    },
  {
      routePath: "/api/instagram",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_instagram_js_onRequestGet],
    },
  {
      routePath: "/api/pay",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_pay_js_onRequestPost],
    },
  {
      routePath: "/api/pay-callback",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_pay_callback_js_onRequestPost],
    },
  {
      routePath: "/api/pay-status",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_pay_status_js_onRequestGet],
    },
  {
      routePath: "/api/track",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_track_js_onRequestPost],
    },
  ]