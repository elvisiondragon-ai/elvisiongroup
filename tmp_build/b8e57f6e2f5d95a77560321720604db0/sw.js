import {registerRoute as workbox_routing_registerRoute} from '/Users/eldragon/git/el/elvisiongroup/node_modules/workbox-routing/registerRoute.mjs';
import {ExpirationPlugin as workbox_expiration_ExpirationPlugin} from '/Users/eldragon/git/el/elvisiongroup/node_modules/workbox-expiration/ExpirationPlugin.mjs';
import {CacheFirst as workbox_strategies_CacheFirst} from '/Users/eldragon/git/el/elvisiongroup/node_modules/workbox-strategies/CacheFirst.mjs';
import {clientsClaim as workbox_core_clientsClaim} from '/Users/eldragon/git/el/elvisiongroup/node_modules/workbox-core/clientsClaim.mjs';
import {precacheAndRoute as workbox_precaching_precacheAndRoute} from '/Users/eldragon/git/el/elvisiongroup/node_modules/workbox-precaching/precacheAndRoute.mjs';
import {cleanupOutdatedCaches as workbox_precaching_cleanupOutdatedCaches} from '/Users/eldragon/git/el/elvisiongroup/node_modules/workbox-precaching/cleanupOutdatedCaches.mjs';
import {NavigationRoute as workbox_routing_NavigationRoute} from '/Users/eldragon/git/el/elvisiongroup/node_modules/workbox-routing/NavigationRoute.mjs';
import {createHandlerBoundToURL as workbox_precaching_createHandlerBoundToURL} from '/Users/eldragon/git/el/elvisiongroup/node_modules/workbox-precaching/createHandlerBoundToURL.mjs';/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */








self.skipWaiting();

workbox_core_clientsClaim();


/**
 * The precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
workbox_precaching_precacheAndRoute([
  {
    "url": "apple-touch-icon.png",
    "revision": "c783bf277adf350c3d2654457d2e2777"
  },
  {
    "url": "assets/admin_webinar-CUvEUGHV.js",
    "revision": null
  },
  {
    "url": "assets/admin_withdrawals-IMblv29k.js",
    "revision": null
  },
  {
    "url": "assets/AdminBadge-D-mH8sAw.js",
    "revision": null
  },
  {
    "url": "assets/adress-B_APyUmg.js",
    "revision": null
  },
  {
    "url": "assets/affiliate-CjgheXyF.js",
    "revision": null
  },
  {
    "url": "assets/animation-vendor-CFPr9eGy.js",
    "revision": null
  },
  {
    "url": "assets/AudioTherapy-60bkgAYa.js",
    "revision": null
  },
  {
    "url": "assets/avatar-SUyYEksn.js",
    "revision": null
  },
  {
    "url": "assets/badge-B_OAhulT.js",
    "revision": null
  },
  {
    "url": "assets/browser-ponyfill-NlCgBbik.js",
    "revision": null
  },
  {
    "url": "assets/chart-vendor-Cg6SL9Bk.js",
    "revision": null
  },
  {
    "url": "assets/Chat-DgZjTzLG.js",
    "revision": null
  },
  {
    "url": "assets/creator_api-DkP33YVI.js",
    "revision": null
  },
  {
    "url": "assets/DeleteAccount-Bh8nqR-t.js",
    "revision": null
  },
  {
    "url": "assets/dev-BfRGstE8.ico",
    "revision": null
  },
  {
    "url": "assets/dev-CBXtamit.js",
    "revision": null
  },
  {
    "url": "assets/dialog-CQ9QN4aG.js",
    "revision": null
  },
  {
    "url": "assets/display-Cm5VEUFe.js",
    "revision": null
  },
  {
    "url": "assets/drelf-ByhMIg6t.png",
    "revision": null
  },
  {
    "url": "assets/drelf-CLPosPH4.js",
    "revision": null
  },
  {
    "url": "assets/drelflp-CtacHJAJ.js",
    "revision": null
  },
  {
    "url": "assets/elroyaleparfum-_1fqnSDz.js",
    "revision": null
  },
  {
    "url": "assets/elvisionlibrary-WZyPP1Hp.js",
    "revision": null
  },
  {
    "url": "assets/fbpixel-B6CyFah2.js",
    "revision": null
  },
  {
    "url": "assets/fitfactor-DxFaW3AL.js",
    "revision": null
  },
  {
    "url": "assets/fitfactorlp--rJUGN6j.js",
    "revision": null
  },
  {
    "url": "assets/Formid-CZGYWuAu.js",
    "revision": null
  },
  {
    "url": "assets/Home-DpXl6Od3.js",
    "revision": null
  },
  {
    "url": "assets/hungrylater-BNTLUJ7A.js",
    "revision": null
  },
  {
    "url": "assets/icons-vendor-tGbdpmH2.js",
    "revision": null
  },
  {
    "url": "assets/IgnisQuest-BVELg79o.js",
    "revision": null
  },
  {
    "url": "assets/index-BdQq_4o_.js",
    "revision": null
  },
  {
    "url": "assets/index-BHBo_d_R.css",
    "revision": null
  },
  {
    "url": "assets/index-BHqotUiu.js",
    "revision": null
  },
  {
    "url": "assets/index-Bi5pwZRj.js",
    "revision": null
  },
  {
    "url": "assets/index-C5vbhr3c.js",
    "revision": null
  },
  {
    "url": "assets/Index-CVnmfL5y.js",
    "revision": null
  },
  {
    "url": "assets/intro-DsUZ6aLo.js",
    "revision": null
  },
  {
    "url": "assets/Leaderboard-B7fZpjac.js",
    "revision": null
  },
  {
    "url": "assets/leadmagnet-C0fc8hQx.js",
    "revision": null
  },
  {
    "url": "assets/MeditationSessions-B59U3NF3.js",
    "revision": null
  },
  {
    "url": "assets/NotFound-BC0-r4Q-.js",
    "revision": null
  },
  {
    "url": "assets/Payment-CqCzZC-c.js",
    "revision": null
  },
  {
    "url": "assets/pixels-DTEdgOI_.js",
    "revision": null
  },
  {
    "url": "assets/Profile-CsM4rxFa.js",
    "revision": null
  },
  {
    "url": "assets/progress-CNcK8rW1.js",
    "revision": null
  },
  {
    "url": "assets/prostatus-BQJTy3pN.js",
    "revision": null
  },
  {
    "url": "assets/radio-group-CFqWEe7n.js",
    "revision": null
  },
  {
    "url": "assets/react-vendor--b_VJCfd.js",
    "revision": null
  },
  {
    "url": "assets/reportsales-CJZDYiAk.js",
    "revision": null
  },
  {
    "url": "assets/reportsalesadmin-0MHJWb4d.js",
    "revision": null
  },
  {
    "url": "assets/reseller-z2AtvQ1A.js",
    "revision": null
  },
  {
    "url": "assets/riset-Cwr4uITG.js",
    "revision": null
  },
  {
    "url": "assets/select-C1y8yLRb.js",
    "revision": null
  },
  {
    "url": "assets/separator-hp90Mdt-.js",
    "revision": null
  },
  {
    "url": "assets/shopauto-BbN3cEq_.js",
    "revision": null
  },
  {
    "url": "assets/shortverse1-Bjomps8u.png",
    "revision": null
  },
  {
    "url": "assets/SpiritualJournal-C5cAoExx.js",
    "revision": null
  },
  {
    "url": "assets/supabase-vendor-DvJYYtc0.js",
    "revision": null
  },
  {
    "url": "assets/switch-CTXOSqH4.js",
    "revision": null
  },
  {
    "url": "assets/table-DGCSBP-3.js",
    "revision": null
  },
  {
    "url": "assets/testimony-DVDOisIn.js",
    "revision": null
  },
  {
    "url": "assets/textarea-DP4ZN2zL.js",
    "revision": null
  },
  {
    "url": "assets/ui-vendor-nqgNZ38E.js",
    "revision": null
  },
  {
    "url": "assets/usePro-CKZsKs0L.js",
    "revision": null
  },
  {
    "url": "assets/useTranslation-6M1JCnd0.js",
    "revision": null
  },
  {
    "url": "assets/utils-vendor-BAUuumSr.js",
    "revision": null
  },
  {
    "url": "assets/web-Dmd91zdp.js",
    "revision": null
  },
  {
    "url": "assets/whatispro-ClHxkn25.js",
    "revision": null
  },
  {
    "url": "assets/workbox-window.prod.es5-B9K5rw8f.js",
    "revision": null
  },
  {
    "url": "cache.html",
    "revision": "18121c2cdddecc51d42bf6788dad17b4"
  },
  {
    "url": "favicon.ico",
    "revision": "fb2c00a05282c0cbcb7e53b8bfe63941"
  },
  {
    "url": "favicon.png",
    "revision": "a7d58a9d70ae4e242b330d2186fce1e6"
  },
  {
    "url": "index.html",
    "revision": "fc18ff5fbc650a46aa072f55682a4af5"
  },
  {
    "url": "placeholder.svg",
    "revision": "35707bd9960ba5281c72af927b79291f"
  },
  {
    "url": "unregister-sw.js",
    "revision": "65cb1a749d9cb21cad902c2495530606"
  },
  {
    "url": "apple-touch-icon.png",
    "revision": "c783bf277adf350c3d2654457d2e2777"
  },
  {
    "url": "favicon.png",
    "revision": "a7d58a9d70ae4e242b330d2186fce1e6"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "5ef0e3698f34bcdfd8eda569fb2dfac2"
  }
], {});
workbox_precaching_cleanupOutdatedCaches();
workbox_routing_registerRoute(new workbox_routing_NavigationRoute(workbox_precaching_createHandlerBoundToURL("/index.html"), {
  
  denylist: [/^\/_/,/\/[^/?]+\.[^/]+$/],
}));


workbox_routing_registerRoute(/\.(?:mp3|wav|ogg|m4a)$/i, new workbox_strategies_CacheFirst({ "cacheName":"audio-cache", plugins: [new workbox_expiration_ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 31536000 })] }), 'GET');
workbox_routing_registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox_strategies_CacheFirst({ "cacheName":"google-fonts-cache", plugins: [new workbox_expiration_ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 31536000 })] }), 'GET');
workbox_routing_registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox_strategies_CacheFirst({ "cacheName":"gstatic-fonts-cache", plugins: [new workbox_expiration_ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 31536000 })] }), 'GET');
workbox_routing_registerRoute(/\.(?:png|jpg|jpeg|svg|gif|webp)$/, new workbox_strategies_CacheFirst({ "cacheName":"images-cache", plugins: [new workbox_expiration_ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 2592000 })] }), 'GET');




