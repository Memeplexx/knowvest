if(!self.define){let e,s={};const c=(c,a)=>(c=new URL(c+".js",a).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(a,i)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let t={};const f=e=>c(e,n),r={module:{uri:n},exports:t,require:f};s[n]=Promise.all(a.map((e=>r[e]||f(e)))).then((e=>(i(...e),t)))}}define(["./workbox-7c2a5a06"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/R1ZOddl87jSjQKloSqsZi/_buildManifest.js",revision:"fb675cf318b438c97da606528047a5f6"},{url:"/_next/static/R1ZOddl87jSjQKloSqsZi/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/1053.e969bdafb8c5efa1.js",revision:"e969bdafb8c5efa1"},{url:"/_next/static/chunks/1084.581aa5e7a79daba5.js",revision:"581aa5e7a79daba5"},{url:"/_next/static/chunks/1390.7bc8383d8c66788a.js",revision:"7bc8383d8c66788a"},{url:"/_next/static/chunks/1446.65a349921f4189ed.js",revision:"65a349921f4189ed"},{url:"/_next/static/chunks/1639.3733e86f31f64642.js",revision:"3733e86f31f64642"},{url:"/_next/static/chunks/1650.026b4c3b805fe3c6.js",revision:"026b4c3b805fe3c6"},{url:"/_next/static/chunks/1660.2358df4bbf97e22d.js",revision:"2358df4bbf97e22d"},{url:"/_next/static/chunks/1706.afdd8d312119d9b4.js",revision:"afdd8d312119d9b4"},{url:"/_next/static/chunks/177.1eda550f12250ea7.js",revision:"1eda550f12250ea7"},{url:"/_next/static/chunks/1770.ffd38031b937c10a.js",revision:"ffd38031b937c10a"},{url:"/_next/static/chunks/1820-78b0278803014ad4.js",revision:"78b0278803014ad4"},{url:"/_next/static/chunks/1873.bc4d96d38cd4503f.js",revision:"bc4d96d38cd4503f"},{url:"/_next/static/chunks/1920.f1982fe53562fe17.js",revision:"f1982fe53562fe17"},{url:"/_next/static/chunks/2040.6524e900a7a92eae.js",revision:"6524e900a7a92eae"},{url:"/_next/static/chunks/2119.ddc2632df0901484.js",revision:"ddc2632df0901484"},{url:"/_next/static/chunks/2136.2b02eec8a90f77f2.js",revision:"2b02eec8a90f77f2"},{url:"/_next/static/chunks/2200.6c3d920376e33845.js",revision:"6c3d920376e33845"},{url:"/_next/static/chunks/228.1a39f1d039ac010d.js",revision:"1a39f1d039ac010d"},{url:"/_next/static/chunks/2314.34392dbf51b696af.js",revision:"34392dbf51b696af"},{url:"/_next/static/chunks/2386.8081519d89107915.js",revision:"8081519d89107915"},{url:"/_next/static/chunks/2406.ad2392b18b7e6d17.js",revision:"ad2392b18b7e6d17"},{url:"/_next/static/chunks/2542.82fcb9f7206aadce.js",revision:"82fcb9f7206aadce"},{url:"/_next/static/chunks/2554.d22f48728a4b943b.js",revision:"d22f48728a4b943b"},{url:"/_next/static/chunks/2602.c5dc1c72d2de78a8.js",revision:"c5dc1c72d2de78a8"},{url:"/_next/static/chunks/2675.3af9b237ab623dbf.js",revision:"3af9b237ab623dbf"},{url:"/_next/static/chunks/2877.eb3a09d0235603ad.js",revision:"eb3a09d0235603ad"},{url:"/_next/static/chunks/305.a333c808a3e770bf.js",revision:"a333c808a3e770bf"},{url:"/_next/static/chunks/310.141abc65f2272a79.js",revision:"141abc65f2272a79"},{url:"/_next/static/chunks/3203.543ba3f6288790fd.js",revision:"543ba3f6288790fd"},{url:"/_next/static/chunks/3236.3711a0b8fcd662b8.js",revision:"3711a0b8fcd662b8"},{url:"/_next/static/chunks/3283.2512a1ac796c85aa.js",revision:"2512a1ac796c85aa"},{url:"/_next/static/chunks/3314.738a7ef4f9f024df.js",revision:"738a7ef4f9f024df"},{url:"/_next/static/chunks/3465.ccc167d0663fc888.js",revision:"ccc167d0663fc888"},{url:"/_next/static/chunks/3482.2ef27abecbbd2f0b.js",revision:"2ef27abecbbd2f0b"},{url:"/_next/static/chunks/3509.0088e9278997a2a4.js",revision:"0088e9278997a2a4"},{url:"/_next/static/chunks/3519.2a44d25a006ebc05.js",revision:"2a44d25a006ebc05"},{url:"/_next/static/chunks/370.179fb095da625926.js",revision:"179fb095da625926"},{url:"/_next/static/chunks/3747.83c0cfaf79f6068b.js",revision:"83c0cfaf79f6068b"},{url:"/_next/static/chunks/3883.8ed90baeba66df5a.js",revision:"8ed90baeba66df5a"},{url:"/_next/static/chunks/3993.b57725942181d336.js",revision:"b57725942181d336"},{url:"/_next/static/chunks/402.7d80bdb28f06c969.js",revision:"7d80bdb28f06c969"},{url:"/_next/static/chunks/4144.f34b5795cfeaaf43.js",revision:"f34b5795cfeaaf43"},{url:"/_next/static/chunks/4163.199b7119e5f59f9c.js",revision:"199b7119e5f59f9c"},{url:"/_next/static/chunks/4212.b67615191f0e2a26.js",revision:"b67615191f0e2a26"},{url:"/_next/static/chunks/4293.dd53e4fcbaca55d6.js",revision:"dd53e4fcbaca55d6"},{url:"/_next/static/chunks/4323.7696c347cadd6791.js",revision:"7696c347cadd6791"},{url:"/_next/static/chunks/4439.83c00df0a91299b2.js",revision:"83c00df0a91299b2"},{url:"/_next/static/chunks/4511.818a82b6e9a4ac91.js",revision:"818a82b6e9a4ac91"},{url:"/_next/static/chunks/4796.4beb0d141dabf123.js",revision:"4beb0d141dabf123"},{url:"/_next/static/chunks/4810.0e08b599d47298f5.js",revision:"0e08b599d47298f5"},{url:"/_next/static/chunks/4812.f741cc3312f0d0b0.js",revision:"f741cc3312f0d0b0"},{url:"/_next/static/chunks/4879.c9df537e25dcbdc6.js",revision:"c9df537e25dcbdc6"},{url:"/_next/static/chunks/4ad82c5e-a49aa628690b38fd.js",revision:"a49aa628690b38fd"},{url:"/_next/static/chunks/5134.003a0153bfbc6d1e.js",revision:"003a0153bfbc6d1e"},{url:"/_next/static/chunks/520.18224703a2d810a7.js",revision:"18224703a2d810a7"},{url:"/_next/static/chunks/5372.f126fa37c7d17bb5.js",revision:"f126fa37c7d17bb5"},{url:"/_next/static/chunks/5648.0706385c9ec08b7d.js",revision:"0706385c9ec08b7d"},{url:"/_next/static/chunks/5753.7387a3b0c233f990.js",revision:"7387a3b0c233f990"},{url:"/_next/static/chunks/5815.0b84ef3235b679a8.js",revision:"0b84ef3235b679a8"},{url:"/_next/static/chunks/5819.a59443e62006c745.js",revision:"a59443e62006c745"},{url:"/_next/static/chunks/5879.e382988b29afcc72.js",revision:"e382988b29afcc72"},{url:"/_next/static/chunks/6062.0513091428309707.js",revision:"0513091428309707"},{url:"/_next/static/chunks/6092.4c14971fb9584bf5.js",revision:"4c14971fb9584bf5"},{url:"/_next/static/chunks/6121.9da26d4f9229a6f2.js",revision:"9da26d4f9229a6f2"},{url:"/_next/static/chunks/617.a9ace9aa76c1968e.js",revision:"a9ace9aa76c1968e"},{url:"/_next/static/chunks/6395.670304e2bea12bb3.js",revision:"670304e2bea12bb3"},{url:"/_next/static/chunks/6443.4c517da50520a051.js",revision:"4c517da50520a051"},{url:"/_next/static/chunks/6471.f7af6e7878e919bf.js",revision:"f7af6e7878e919bf"},{url:"/_next/static/chunks/6665.c449168b5af1f44f.js",revision:"c449168b5af1f44f"},{url:"/_next/static/chunks/6692.7009dbefd77bf1fd.js",revision:"7009dbefd77bf1fd"},{url:"/_next/static/chunks/673.f015693f435bb2b9.js",revision:"f015693f435bb2b9"},{url:"/_next/static/chunks/6732.9d60200ada776172.js",revision:"9d60200ada776172"},{url:"/_next/static/chunks/6991.e1b30c5960486342.js",revision:"e1b30c5960486342"},{url:"/_next/static/chunks/7001.c154b233098b6ec8.js",revision:"c154b233098b6ec8"},{url:"/_next/static/chunks/7213.085c017a9039214b.js",revision:"085c017a9039214b"},{url:"/_next/static/chunks/7315.05666c3b2ffb12ef.js",revision:"05666c3b2ffb12ef"},{url:"/_next/static/chunks/7365.67ef87ab5d7bacaa.js",revision:"67ef87ab5d7bacaa"},{url:"/_next/static/chunks/7370.ef4404d5f17fc707.js",revision:"ef4404d5f17fc707"},{url:"/_next/static/chunks/7421.b5495f8d3f87b734.js",revision:"b5495f8d3f87b734"},{url:"/_next/static/chunks/7475.33cdfeeeabe55d86.js",revision:"33cdfeeeabe55d86"},{url:"/_next/static/chunks/7525.80836023d9201706.js",revision:"80836023d9201706"},{url:"/_next/static/chunks/758.a2c6809da8d122f0.js",revision:"a2c6809da8d122f0"},{url:"/_next/static/chunks/7601.ff70b10d1d4e21aa.js",revision:"ff70b10d1d4e21aa"},{url:"/_next/static/chunks/7663.fbe012e8f622582a.js",revision:"fbe012e8f622582a"},{url:"/_next/static/chunks/7762.e2f992d2966b61e2.js",revision:"e2f992d2966b61e2"},{url:"/_next/static/chunks/7917.08ef62244124fa7b.js",revision:"08ef62244124fa7b"},{url:"/_next/static/chunks/7988.47eec30b4edf5fe2.js",revision:"47eec30b4edf5fe2"},{url:"/_next/static/chunks/8007.cbf5b340f2ad7cf0.js",revision:"cbf5b340f2ad7cf0"},{url:"/_next/static/chunks/8029.44e0b6ee2d85bd1b.js",revision:"44e0b6ee2d85bd1b"},{url:"/_next/static/chunks/8142.ae874d2e3b3b4367.js",revision:"ae874d2e3b3b4367"},{url:"/_next/static/chunks/8171.3062f54fce8f6a1f.js",revision:"3062f54fce8f6a1f"},{url:"/_next/static/chunks/8283.f41216fedc310fb2.js",revision:"f41216fedc310fb2"},{url:"/_next/static/chunks/8393.a59051c3000f190a.js",revision:"a59051c3000f190a"},{url:"/_next/static/chunks/8561.35c9a873764ca833.js",revision:"35c9a873764ca833"},{url:"/_next/static/chunks/870.a210a4db523f77b0.js",revision:"a210a4db523f77b0"},{url:"/_next/static/chunks/8770.5ea9001025680f18.js",revision:"5ea9001025680f18"},{url:"/_next/static/chunks/8813.cf85ff5f357e7826.js",revision:"cf85ff5f357e7826"},{url:"/_next/static/chunks/889.29d4ff2de4320133.js",revision:"29d4ff2de4320133"},{url:"/_next/static/chunks/8910.81b28c37387ea505.js",revision:"81b28c37387ea505"},{url:"/_next/static/chunks/8915.8e96d1b98a7215de.js",revision:"8e96d1b98a7215de"},{url:"/_next/static/chunks/9071.b2bb6df1514a6618.js",revision:"b2bb6df1514a6618"},{url:"/_next/static/chunks/9121.fb50e1080184cc67.js",revision:"fb50e1080184cc67"},{url:"/_next/static/chunks/9155.c2625b91763001a0.js",revision:"c2625b91763001a0"},{url:"/_next/static/chunks/9232.688530d7eeace7a5.js",revision:"688530d7eeace7a5"},{url:"/_next/static/chunks/9296.435a1ccd1d98acbd.js",revision:"435a1ccd1d98acbd"},{url:"/_next/static/chunks/9558.3427863e310e033c.js",revision:"3427863e310e033c"},{url:"/_next/static/chunks/9563-c9cdfebf9fc28f94.js",revision:"c9cdfebf9fc28f94"},{url:"/_next/static/chunks/9607.beb04f0824152450.js",revision:"beb04f0824152450"},{url:"/_next/static/chunks/9713.f1d5b41171c6487d.js",revision:"f1d5b41171c6487d"},{url:"/_next/static/chunks/9781.cf1bb7b18d9c3c42.js",revision:"cf1bb7b18d9c3c42"},{url:"/_next/static/chunks/9831.dfa5e3f181b1516d.js",revision:"dfa5e3f181b1516d"},{url:"/_next/static/chunks/9972.dc5a80e6c246c547.js",revision:"dc5a80e6c246c547"},{url:"/_next/static/chunks/framework-3671d8951bf44e4e.js",revision:"3671d8951bf44e4e"},{url:"/_next/static/chunks/main-e4b67199fa2ae636.js",revision:"e4b67199fa2ae636"},{url:"/_next/static/chunks/pages/_app-0a2a061ff7cd6425.js",revision:"0a2a061ff7cd6425"},{url:"/_next/static/chunks/pages/_error-bd1da5a6907513b5.js",revision:"bd1da5a6907513b5"},{url:"/_next/static/chunks/pages/home-d04667863e90b556.js",revision:"d04667863e90b556"},{url:"/_next/static/chunks/pages/index-47302383cd2d3ca1.js",revision:"47302383cd2d3ca1"},{url:"/_next/static/chunks/pages/login-5b0a4be8693d2ee4.js",revision:"5b0a4be8693d2ee4"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-30566547a7b96f29.js",revision:"30566547a7b96f29"},{url:"/_next/static/css/3c7660ba400e1b54.css",revision:"3c7660ba400e1b54"},{url:"/_next/static/media/0b863ff291de969e-s.woff2",revision:"5c6daa95c20d89b04bb8cb866c60a635"},{url:"/_next/static/media/1060bab20f18b5c2-s.p.woff2",revision:"d5de368ad6cb9721be72319431de3adb"},{url:"/_next/static/media/23fb5b3df3464bb3-s.woff2",revision:"751f874f431804fc769f2051e30ec621"},{url:"/_next/static/media/4340d51a9bd4330c-s.woff2",revision:"84cf14456a16f28a9bf9e6f7b80a5dfa"},{url:"/_next/static/media/447ce8db59149e35-s.p.woff2",revision:"d7236fc324ea06ebe34915206babd28b"},{url:"/_next/static/media/50188d80bad94e38-s.woff2",revision:"3454e1c813aad0b9bc6c72d71348c6a0"},{url:"/_next/static/media/698320915c58e4ba-s.woff2",revision:"f178ab54bf97d3777d5a798e3242f927"},{url:"/_next/static/media/8ed0c04f7e5d7b36-s.woff2",revision:"d9e0d8b1dd2f16658a138c486b5c8c76"},{url:"/_next/static/media/91ff6455a84f6e50-s.woff2",revision:"92527e8df10e0deec3715e65587a7f37"},{url:"/_next/static/media/978e8a64d72b8c6e-s.woff2",revision:"cb3b0bf4f200f8396e2f1ac704a6cce3"},{url:"/_next/static/media/9cbb0a469dcb7133-s.woff2",revision:"3ee09c6337076fd6d3b5797383936c3d"},{url:"/_next/static/media/a1b296c8f423a2cf-s.woff2",revision:"aa77f91c32023007d75971efefa72184"},{url:"/_next/static/media/b1464bad92c88a2d-s.woff2",revision:"86d7730928022ce4a8457e979238654b"},{url:"/_next/static/media/c528baaebca50056-s.woff2",revision:"b043858588196a795ae0613d36b0b7d4"},{url:"/_next/static/media/d6ed8c16ea958266-s.p.woff2",revision:"3006fe68ffbe248677439fee0d3ba79c"},{url:"/_next/static/media/dcbfbbad8065ad1b-s.woff2",revision:"b9ff615dffa275ad9d8191a95074564b"},{url:"/_next/static/media/df4ba022c23c08de-s.woff2",revision:"60883f3586a85c7be1f5aa9e985aea48"},{url:"/_next/static/media/f60bbb0fb4788069-s.woff2",revision:"0365343558a0ce676dff83f2c1111a54"},{url:"/_next/static/media/feb74b7aefcf5232-s.woff2",revision:"e9e31e281be2efa867d4ef80ed3ad87c"},{url:"/favicon.ico",revision:"c30c7d42707a47a3f4591831641e50dc"},{url:"/icon-192x192.png",revision:"244fc3798840f3916b525cbf3632c6b0"},{url:"/icon-256x256.png",revision:"f432b7abb634e12417089997687c515d"},{url:"/icon-384x384.png",revision:"8573bf329ed01725dae3dfb6035b33de"},{url:"/icon-512x512.png",revision:"5f1ac2964f9058ad481520817dc1e75e"},{url:"/images/add-file.svg",revision:"c7a3f43de590c00bd1234969acc5fbd6"},{url:"/images/farm.png",revision:"c15044020c2a25f14d0f42689aa65c06"},{url:"/images/landing-backdrop-monochrome.png",revision:"536b0ded26647a99f26cf88bbded3b4f"},{url:"/images/landing-backdrop.png",revision:"3770af13d331581861b3443ca4090f90"},{url:"/images/profile.jpg",revision:"5cf908697b562f97bda41eceb3307276"},{url:"/images/user.svg",revision:"593d61530605c24509ba08113fa13d34"},{url:"/manifest.webmanifest",revision:"eca1fed4203247cef9484a97546f558e"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:c,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
