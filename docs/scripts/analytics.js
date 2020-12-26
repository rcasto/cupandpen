const app = 'cupandpen';
const sessionKey = 'analytics-session-id';

const eventTypes = {
    pageView: 'page-view',
};

function createEvent(analyticsId, type, data = null) {
    return {
        type,
        analyticsId,
        app,
        data,
    };
}

function createEventGenerator(analyticsId) {
    return {
        createPageView: function (data = null) {
            return createEvent(analyticsId, eventTypes.pageView, data);
        },
    };
}

// https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-253.php
function generateUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
}

// develop a separate npm package for my own internal analytics
// Supply appName to init
// external interface is: trackAction, trackPageView

window.addEventListener('load', () => {
    // Check if beacon api is supported first

    let analyticsId = window.sessionStorage.getItem(sessionKey);
    if (!analyticsId) {
        analyticsId = generateUUID();
        window.sessionStorage.setItem(sessionKey, analyticsId);
    }

    const eventGenerator = createEventGenerator(analyticsId);
    const pageViewEvent = eventGenerator.createPageView({
        url: window.location.href,
    });

    const dataBlob = new Blob([JSON.stringify(pageViewEvent)], {
        type: 'application/json'
    });
    window.navigator.sendBeacon('http://localhost:3000/analytics', dataBlob);
});