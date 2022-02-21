const appName = 'cupandpen';
const analyticsApiUrl = 'https://project-analytics.fly.dev/analytics';
const eventTypes = {
    pageView: 'page-view',
};

const eventGenerator = window.SimpleTrack.createEventGenerator({
    appName,
    analyticsApiUrl,
});

window.addEventListener('load', () => {
    const pageViewEventData = {
        url: window.location.href,
    };
    eventGenerator.track(eventTypes.pageView, pageViewEventData);
});