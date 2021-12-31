const appName = 'cupandpen';
const analyticsApiUrl = 'https://analytics-service-299521.ue.r.appspot.com/analytics';
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