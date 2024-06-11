const commonConfig = require('cccommon/config');
const newsEventDal = require('cccommon/dal/news_event');
const appErr = require('this_pkg/error');

function isBoolean(value) {
    return typeof value === 'boolean';
  }

exports.handler = async (req, res) => {
    const successStatus = 201;
    const {
        news_title,
        news_video_url,
        news_reference_link,
        news_content_text,
        news_event_duration,
        id_news_type,
        id_user
    } = req.body;
    let news_image_url = null;
    if (req.files && req.files.news_image_url) {
        news_image_url = req.files.news_image_url[0].path;
    }

    let news_is_highlighted = false;

    if (req.body.hasOwnProperty('news_is_highlighted')) {
        if (typeof req.body.news_is_highlighted === 'string') {
            news_is_highlighted = req.body.news_is_highlighted === "true";
        } else if (typeof req.body.news_is_highlighted === 'boolean') {
            news_is_highlighted = req.body.news_is_highlighted;
        }
    }

    const valErrs = [];
    const requiredFields = [
        'news_title',
        'news_video_url',
        'news_reference_link',
        'news_content_text',
        'news_event_duration',
        'news_is_highlighted',
        'id_news_type',
        'id_user'
    ];

    requiredFields.forEach(field => {
        if (!req.body[field]) {
            valErrs.push({ [field]: 'missing' });
        }
    });

    if (typeof news_is_highlighted === 'string') {
        news_is_highlighted = news_is_highlighted === "true";
    }

    if (typeof news_is_highlighted !== 'boolean') {
        valErrs.push({ news_is_highlighted: 'missing or not a boolean' });
    }

    // Validation for character limits
    const maxLengths = {
        news_title: 100,
        news_content_text: 1000,
        news_event_duration: 50,
        news_video_url: 500,
        news_reference_link: 500
    };
    const minLengths = {
        news_title: 10,
        news_content_text: 20,
        news_event_duration: 10,
        news_video_url: 35,
        news_reference_link: 35
    };

    for (const field in maxLengths) {
        if (req.body[field] && req.body[field].length > maxLengths[field]) {
            valErrs.push({ [field]: `should not exceed ${maxLengths[field]} characters` });
        }
    }

    for (const field in minLengths) {
        if (req.body[field] && req.body[field].length < minLengths[field]) {
            valErrs.push({ [field]: `should have at least ${minLengths[field]} characters` });
        }
    }

    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const fieldsToCheckForSpecialChars = [
        'news_title',
        'news_content_text',
        'news_event_duration',
        'news_video_url',
        'news_reference_link',
        'id_news_type',
        'id_user'
    ];

    fieldsToCheckForSpecialChars.forEach(field => {
        if (req.body[field] && specialCharsRegex.test(req.body[field])) {
            valErrs.push({ [field]: 'contains special characters' });
        }
    });

    const leadingSpaceRegex = /^\s+/;
    requiredFields.forEach(field => {
        if (req.body[field] && leadingSpaceRegex.test(req.body[field])) {
            valErrs.push({ [field]: 'starts with excessive whitespace' });
        }
    });

    const maxImageSize = 1 * 1024 * 1024;
    if (req.files && req.files.news_image_url && req.files.news_image_url[0].size > maxImageSize) {
        valErrs.push({ news_image_url: 'image size should not exceed 1 MB' });
    }

    const onlyDigitsRegex = /^\d+$/;
    if (!onlyDigitsRegex.test(id_news_type)) {
        valErrs.push({ id_news_type: 'should contain only numeric values' });
    }
    if (!onlyDigitsRegex.test(id_user)) {
        valErrs.push({ id_user: 'should contain only numeric values' });
    }

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {
        const newsEvent = await newsEventDal.createNewsEvent({
            news_title,
            news_image_url,
            news_video_url,
            news_reference_link,
            news_content_text,
            news_event_duration,
            news_is_highlighted,
            id_news_type,
            id_user
        });

        res.status(successStatus).send({
            id_news_event: newsEvent.id_news_event,
            news_title: newsEvent.news_title,
            news_image_url: newsEvent.news_image_url,
            news_video_url: newsEvent.news_video_url,
            news_reference_link: newsEvent.news_reference_link,
            news_content_text: newsEvent.news_content_text,
            news_event_duration: newsEvent.news_event_duration,
            news_is_highlighted: newsEvent.news_is_highlighted,
            id_news_type: newsEvent.id_news_type,
            id_user: newsEvent.id_user
        });

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to create news/event');
    }
};
