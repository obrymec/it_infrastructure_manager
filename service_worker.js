let coepCredentialless=!1;"undefined"==typeof window?(self.addEventListener("install",(()=>self.skipWaiting())),self.addEventListener("activate",(e=>e.waitUntil(self.clients.claim()))),self.addEventListener("message",(e=>{e.data&&("deregister"===e.data.type?self.registration.unregister().then((()=>self.clients.matchAll())).then((e=>{e.forEach((e=>e.navigate(e.url)))})):"coepCredentialless"===e.data.type&&(coepCredentialless=e.data.value))})),self.addEventListener("fetch",(function(e){const o=e.request;if("only-if-cached"===o.cache&&"same-origin"!==o.mode)return;const s=coepCredentialless&&"no-cors"===o.mode?new Request(o,{credentials:"omit"}):o;e.respondWith(fetch(s).then((e=>{if(0===e.status)return e;const o=new Headers(e.headers);return o.set("Cross-Origin-Embedder-Policy",coepCredentialless?"credentialless":"require-corp"),coepCredentialless||o.set("Cross-Origin-Resource-Policy","cross-origin"),o.set("Cross-Origin-Opener-Policy","same-origin"),new Response(e.body,{status:e.status,statusText:e.statusText,headers:o})})).catch((e=>console.error(e))))}))):(()=>{const e=window.sessionStorage.getItem("coiReloadedBySelf");window.sessionStorage.removeItem("coiReloadedBySelf");const o="coepdegrade"==e,s={shouldRegister:()=>!e,shouldDeregister:()=>!1,coepCredentialless:()=>!0,coepDegrade:()=>!0,doReload:()=>window.location.reload(),quiet:!1,...window.coi},r=navigator,t=r.serviceWorker&&r.serviceWorker.controller;t&&!window.crossOriginIsolated&&window.sessionStorage.setItem("coiCoepHasFailed","true");const i=window.sessionStorage.getItem("coiCoepHasFailed");if(t){const e=s.coepDegrade()&&!(o||window.crossOriginIsolated);r.serviceWorker.controller.postMessage({type:"coepCredentialless",value:!(e||i&&s.coepDegrade())&&s.coepCredentialless()}),e&&(!s.quiet&&console.log("Reloading page to degrade COEP."),window.sessionStorage.setItem("coiReloadedBySelf","coepdegrade"),s.doReload("coepdegrade")),s.shouldDeregister()&&r.serviceWorker.controller.postMessage({type:"deregister"})}!1===window.crossOriginIsolated&&s.shouldRegister()&&(window.isSecureContext?r.serviceWorker?r.serviceWorker.register(window.document.currentScript.src).then((e=>{!s.quiet&&console.log("COOP/COEP Service Worker registered",e.scope),e.addEventListener("updatefound",(()=>{!s.quiet&&console.log("Reloading page to make use of updated COOP/COEP Service Worker."),window.sessionStorage.setItem("coiReloadedBySelf","updatefound"),s.doReload()})),e.active&&!r.serviceWorker.controller&&(!s.quiet&&console.log("Reloading page to make use of COOP/COEP Service Worker."),window.sessionStorage.setItem("coiReloadedBySelf","notcontrolling"),s.doReload())}),(e=>{!s.quiet&&console.error("COOP/COEP Service Worker failed to register:",e)})):!s.quiet&&console.error("COOP/COEP Service Worker not registered, perhaps due to private mode."):!s.quiet&&console.log("COOP/COEP Service Worker not registered, a secure context is required."))})();