(function () {
    'use strict';

    const tracker = (() => {
        const SESSION_TIMEOUT = 1 * 60 * 1000; // 1 minute
        // const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
        const API_BASE_URL = `http://127.0.0.1:5000/api`;

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
                    return url.searchParams.get('website_id');
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

        const getOrCreateId = (key, onCreate) => {
            let id = localStorage.getItem(key);
            if (!id) {
                id = self.crypto.randomUUID();
                localStorage.setItem(key, id);
                if (typeof onCreate === 'function') onCreate(id);
            }
            return id;
        };

        const getVisitorId = () => getOrCreateId('visitorId', (id) => {
            const website_id = getWebsiteId();
            if (website_id) socket.emit('track_visitor', website_id);
        });

        const getSessionId = () => {
            const now = Date.now();
            const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0', 10);
            if (!lastActivity || now - lastActivity > SESSION_TIMEOUT) {
                const newSessionId = self.crypto.randomUUID();
                localStorage.setItem('sessionId', newSessionId);
                return newSessionId;
            }
            return localStorage.getItem('sessionId');
        };

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
            const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0', 10);
            const now = Date.now();
            if (lastActivity && now - lastActivity < SESSION_TIMEOUT) {
                return;
            }

            try {
                const visitor_id = getVisitorId();
                const session_id = getSessionId();
                const website_id = getWebsiteId();

                localStorage.setItem('lastActivity', Date.now().toString());

                const { medium, source, campaign } = getUTMParams();

                const trackingData = {
                    session_id,
                    visitor_id,
                    referrer_url: document.referrer,
                    website_id
                };

                if (medium) trackingData.traffic_medium = medium;
                if (source) trackingData.traffic_source = source;
                if (campaign) trackingData.traffic_campaign = campaign;

                await sendTrackingData('tracking/track-session', trackingData);

                if (website_id) {
                    if (!localStorage.getItem('visitorId')) {
                        localStorage.setItem('visitorId', self.crypto.randomUUID());
                        socket.emit('track_visitor', website_id);
                    }

                    socket.emit('track_session', website_id);
                }
            } catch { }
        };

        const trackPageView = async () => {
            const session_id = getSessionId();
            const website_id = getWebsiteId();

            const trackingData = {
                session_id,
                page_title: document.title,
                page_url: document.URL,
                website_id
            };

            await sendTrackingData('tracking/track-pageview', trackingData);

            if (website_id) {
                socket.emit('track_pageview', website_id);
            }
        };

        const trackEvent = async (event_name) => {
            const session_id = getSessionId();
            const page_url = document.URL;
            const website_id = getWebsiteId();

            const trackingData = {
                session_id,
                event_name,
                page_url,
                website_id
            };

            await sendTrackingData('tracking/track-event', trackingData);

            if (website_id) {
                socket.emit('track_event', website_id);
            }
        };

        const attachEventListeners = () => {
            document.querySelectorAll('.track-event').forEach(element => {
                const eventType = element.getAttribute('data-event') || 'click';

                element.addEventListener(eventType, async event => {
                    if (eventType === 'submit') event.preventDefault();
                    console.log('Event triggered:', eventType);


                    const name = element.getAttribute('data-name') || '';

                    await trackEvent(name);
                });
            });
        };

        let initialized = false;

        const init = async () => {
            if (initialized) return;
            initialized = true;

            await trackSession();
            await Promise.all([trackPageView(), attachEventListeners()]);
        };

        return {
            init,
            trackSession,
            trackPageView,
            trackEvent,
            attachEventListeners,
            getVisitorId,
            getSessionId
        };
    })();

    window.tracker = tracker;
    window.addEventListener('load', tracker.init);

})();