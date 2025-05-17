(function () {
    'use strict';

    const tracker = (() => {
        const SESSION_TIMEOUT = 1 * 60 * 1000; // 1 minute
        // const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
        const API_BASE_URL = `http://127.0.0.1:5000/api/tracking`;

        // Dynamically load Socket.IO client
        const socketIoScript = document.createElement("script");
        socketIoScript.src = "https://cdn.socket.io/4.7.2/socket.io.min.js";
        document.head.appendChild(socketIoScript);

        let socket;
        socketIoScript.onload = () => {
            socket = io('http://127.0.0.1:5000');

            tracker.init();
        };

        const getWebsiteId = () => {
            const scripts = document.getElementsByTagName('script');
            for (let i = 0; i < scripts.length; i++) {
                const src = scripts[i].src;
                if (src && src.includes('tracker.js')) {
                    const url = new URL(src, window.location.origin);
                    return url.searchParams.get('website_uid');
                }
            }
            return null;
        };

        const getUTMParams = () => {
            const params = new URLSearchParams(window.location.search);
            return {
                medium: params.get('utm_medium'),
                source: params.get('utm_source'),
                campaign: params.get('utm_campaign')
            };
        };

        const getOrCreateId = (key, expirationMs = null) => {
            const now = Date.now();
            const lastSet = parseInt(localStorage.getItem(`${key}_time`) || '0', 10);
            let id = localStorage.getItem(key);

            const expired = expirationMs && (!lastSet || now - lastSet > expirationMs);

            if (!id || expired) {
                id = self.crypto.randomUUID();
                localStorage.setItem(key, id);
                if (expirationMs) localStorage.setItem(`${key}_time`, now);
            }

            return id;
        };

        const getVisitorUid = () => {
            const id = getOrCreateId('visitorUid');
            const website_uid = getWebsiteId();
            if (!localStorage.getItem('visitorEmitted') && socket && website_uid) {
                socket.emit('track_visitor', website_uid);
                localStorage.setItem('visitorEmitted', '1');
            }
            return id;
        };

        const getSessionUid = () => getOrCreateId('sessionUid', SESSION_TIMEOUT);

        const sendTrackingData = async (endpoint, data) => {
            try {
                await fetch(`${API_BASE_URL}/${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } catch { }
        };

        const trackSession = async () => {
            const visitor_uid = getVisitorUid();
            const session_uid = getSessionUid();
            const website_uid = getWebsiteId();

            if (!website_uid || !session_uid || !visitor_uid) return;

            const lastSent = parseInt(localStorage.getItem('lastSessionSent') || '0', 10);
            const now = Date.now();
            if (now - lastSent < SESSION_TIMEOUT) return;

            localStorage.setItem('lastSessionSent', now.toString());

            const { medium, source, campaign } = getUTMParams();
            const { ip } = await fetch('https://api.ipify.org?format=json').then(res => res.json());

            const trackingData = {
                website_uid,
                session_uid,
                visitor_uid,
                client_ip: ip,
                ...(medium && { medium }),
                ...(source && { source }),
                ...(campaign && { campaign })
            };

            await sendTrackingData('track-session', trackingData);
            if (socket && website_uid) socket.emit('track_session', website_uid);
        };

        const trackPageView = async () => {
            const session_uid = getSessionUid();
            const website_uid = getWebsiteId();

            // Ensure visitorUid is set in localStorage
            getVisitorUid();

            const trackingData = {
                website_uid,
                session_uid,
                page_title: document.title,
                page_url: document.URL
            };

            await sendTrackingData('track-pageview', trackingData);

            if (socket && website_uid) {
                socket.emit('track_pageview', website_uid);
            }
        };

        const trackEvent = async (event_name) => {
            const session_uid = getSessionUid();
            const page_url = document.URL;
            const website_uid = getWebsiteId();

            // Ensure visitorUid is set in localStorage
            getVisitorUid();

            const trackingData = {
                website_uid,
                session_uid,
                event_name,
                page_url
            };

            await sendTrackingData('track-event', trackingData);

            if (socket && website_uid) {
                socket.emit('track_event', website_uid);
            }
        };

        const attachEventListeners = () => {
            const addListeners = () => {
                document.querySelectorAll('.track-event').forEach(element => {
                    const eventType = element.getAttribute('data-event') || 'click';
                    element.addEventListener(eventType, async event => {
                        if (eventType === 'submit') event.preventDefault();
                        const name = element.getAttribute('data-name') || '';
                        await tracker.trackEvent(name);
                    });
                });
            };

            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                addListeners();
            } else {
                document.addEventListener('DOMContentLoaded', addListeners);
            }
        };

        let initialized = false;

        const init = async () => {
            if (initialized) return;
            initialized = true;

            await trackSession();
            await trackPageView();
            attachEventListeners();
        };

        return {
            init,
            trackSession,
            trackPageView,
            trackEvent,
            attachEventListeners,
            getVisitorUid,
            getSessionUid
        };
    })();

    window.tracker = tracker;
    window.addEventListener('load', tracker.init);
})();