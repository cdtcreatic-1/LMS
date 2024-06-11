const newsEventDal = require('cccommon/dal/news_event');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const id_news_event = Number(req.params.id_news_event);
    if (!id_news_event) {
        appErr.send(req, res, 'validation_error', 'Missing id_news_event');
        return;
    }

    try {
        const deleted = await newsEventDal.deleteNewsEvent(id_news_event);
        if (deleted) {
            res.status(200).json({ message: 'News/Event deleted successfully' });
        } else {
            appErr.send(req, res, 'news_event_not_found', 'News/Event not found');
        }
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to delete news/event');
    }
};
