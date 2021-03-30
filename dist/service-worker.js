!(function () {
    'use strict';
    const e = 1613396724286,
        t = `cache${e}`,
        n = [
            '/client/client.e90d7403.js',
            '/client/inject_styles.5607aec6.js',
            '/client/index.6f913e7e.js',
            '/client/register.521f1a95.js',
            '/client/index.b2175141.js',
            '/client/profile.b22f3c98.js',
            '/client/about.222fe79e.js',
            '/client/login.c5a030a0.js',
            '/client/index.5bf5e1e8.js',
            '/client/[slug].5c03408e.js',
        ].concat([
            '/service-worker-index.html',
            '/favicon.png',
            '/index.css',
            '/logo-192.png',
            '/logo-512.png',
            '/manifest.json',
            '/tailwind.css',
        ]),
        s = new Set(n);
    self.addEventListener('install', (e) => {
        e.waitUntil(
            caches
                .open(t)
                .then((e) => e.addAll(n))
                .then(() => {
                    self.skipWaiting();
                })
        );
    }),
        self.addEventListener('activate', (e) => {
            e.waitUntil(
                caches.keys().then(async (e) => {
                    for (const n of e) n !== t && (await caches.delete(n));
                    self.clients.claim();
                })
            );
        }),
        self.addEventListener('fetch', (t) => {
            if ('GET' !== t.request.method || t.request.headers.has('range'))
                return;
            const n = new URL(t.request.url),
                c = n.protocol.startsWith('http'),
                a =
                    n.hostname === self.location.hostname &&
                    n.port !== self.location.port,
                i = n.host === self.location.host && s.has(n.pathname),
                l = 'only-if-cached' === t.request.cache && !i;
            !c ||
                a ||
                l ||
                t.respondWith(
                    (async () =>
                        (i && (await caches.match(t.request))) ||
                        (async function (t) {
                            const n = await caches.open(`offline${e}`);
                            try {
                                const e = await fetch(t);
                                return n.put(t, e.clone()), e;
                            } catch (e) {
                                const s = await n.match(t);
                                if (s) return s;
                                throw e;
                            }
                        })(t.request))()
                );
        });
})();
