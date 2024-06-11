const newsEventDal = require('cccommon/dal/news_event');
const appErr = require('this_pkg/error');
const { frontend_host, app_url } = require('cccommon/config');

exports.handler = async (req, res) => {
    
    try {
        const allNewsEvents = await newsEventDal.getAllNewsEvents();
        allNewsEvents.forEach(newsEvent => {
            if (newsEvent?.news_image_url) {
                newsEvent.news_image_url = app_url() + newsEvent.news_image_url;
            }
        });

        res.status(200).json(allNewsEvents);
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to get all news/events');
    }
};
