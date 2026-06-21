import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { w as parseQuery, p as getRouteRulesForPath, F as withQuery, B as toNodeListener, D as useNitroApp } from './chunks/_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:fs';
import 'node:path';

const ISR_URL_PARAM = "__isr_route";

const nitroApp = useNitroApp();
const handler = toNodeListener(nitroApp.h3App);
const listener = function(req, res) {
  const isrRoute = req.headers["x-now-route-matches"];
  if (isrRoute) {
    const { [ISR_URL_PARAM]: url } = parseQuery(isrRoute);
    if (url && typeof url === "string") {
      const routeRules = getRouteRulesForPath(url);
      if (routeRules.isr) {
        req.url = url;
      }
    }
  } else {
    const queryIndex = req.url.indexOf("?");
    const urlQueryIndex = queryIndex === -1 ? -1 : req.url.indexOf(`${ISR_URL_PARAM}=`, queryIndex);
    if (urlQueryIndex !== -1) {
      const { [ISR_URL_PARAM]: url, ...params } = parseQuery(
        req.url.slice(queryIndex)
      );
      if (url && typeof url === "string") {
        const routeRules = getRouteRulesForPath(url);
        if (routeRules.isr) {
          req.url = withQuery(url, params);
        }
      }
    }
  }
  return handler(req, res);
};

export { listener as default };
//# sourceMappingURL=index.mjs.map
