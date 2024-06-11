const newsEventDal = require('cccommon/dal/news_event');
const appErr = require('this_pkg/error');
const { frontend_host, app_url } = require('cccommon/config');

exports.handler = async (req, res) => {
    const id_news_event = Number(req.params.id_news_event);
    if (!id_news_event) {
        appErr.send(req, res, 'validation_error', 'Missing id_news_event');
        return;
    }

    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (specialCharsRegex.test(req.params.id_news_event)) {
      appErr.send(req, res, 'validation_error', 'id_news_event contains special characters');
      return;
    }
    
    try {
        const newsEventFound = await newsEventDal.getNewsEventById(id_news_event); 
        console.log(newsEventFound)
        if (!newsEventFound) {
            appErr.send(req, res, 'news_event_not_found', 'News/Event not found');
            return;
        }

        if (newsEventFound?.news_image_url) {
            newsEventFound.news_image_url = app_url() + newsEventFound.news_image_url;
        } else {
            newsEventFound.news_image_url = null;
        }

        res.status(200).json(newsEventFound);
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to get news/event by id');
    }
};
