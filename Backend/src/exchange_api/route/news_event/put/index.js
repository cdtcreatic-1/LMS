const commonConfig = require('cccommon/config');
const newsEventDal = require('cccommon/dal/news_event');
const appErr = require('this_pkg/error');
const moment = require('moment');

exports.handler = async (req, res) => {
    const successStatus = 200;

    const {
        id_news_event,
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
    let updateData = {};

    if (news_title) updateData.news_title = news_title;
    if (news_video_url) updateData.news_video_url = news_video_url;
    if (news_reference_link) updateData.news_reference_link = news_reference_link;
    if (news_content_text) updateData.news_content_text = news_content_text;
    if (news_event_duration) updateData.news_event_duration = news_event_duration;
    if (news_is_highlighted) updateData.news_is_highlighted = news_is_highlighted;
    if (id_news_type) updateData.id_news_type = id_news_type;
    if (id_user) updateData.id_user = id_user;
    updateData.news_publication_date = new Date();

    if (!id_news_event) {
        appErr.send(req, res, 'missing_id', 'News/Event ID missing');
        return;
    }

    let requiredFields = [
        'news_title',
        'news_content_text',
        'news_is_highlighted',
        'id_news_type',
        'id_user'
    ];

    requiredFields.forEach(field => {
        if (!req.body[field]) {
            valErrs.push({ [field]: 'missing' });
        }
    });

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
        if (updateData[field] && updateData[field].length > maxLengths[field]) {
            valErrs.push({ [field]: `should not exceed ${maxLengths[field]} characters` });
        }
    }

    for (const field in minLengths) {
        if (updateData[field] && updateData[field].length < minLengths[field]) {
            valErrs.push({ [field]: `should have at least ${minLengths[field]} characters` });
        }
    }

    if (typeof news_is_highlighted !== 'boolean') {
        valErrs.push({ news_is_highlighted: 'missing or not a boolean' });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const formatedDate = moment(updateData.news_publication_date).format('YYYY-MM-DD');
    if (!dateRegex.test(formatedDate)) {
        appErr.send(req, res, 'invalid_input', 'Invalid date format. Expected format: YYYY-MM-DD');
        return;
    }

    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const fieldsToCheckForSpecialChars = [
        'news_title',
        'news_content_text',
        'news_video_url',
        'news_reference_link',
        'id_news_type',
        'id_user'
    ];

    fieldsToCheckForSpecialChars.forEach(field => {
        if (updateData[field] && specialCharsRegex.test(updateData[field])) {
            valErrs.push({ [field]: 'contains special characters' });
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
        const newsEventExists = await newsEventDal.getNewsEventById(id_news_event);
        if (!newsEventExists) {
            appErr.send(req, res, 'news_event_not_found', 'News/Event not found');
            return;
        }

        newsEvent = await newsEventDal.updateNewsEvent(id_news_event, updateData);

        res.status(successStatus).send(newsEvent);

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to update news/event');
    }
};
