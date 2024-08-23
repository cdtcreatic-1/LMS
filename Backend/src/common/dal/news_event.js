const models = require('cccommon/models/internaldb');

async function createNewsEvent(newsEventData) {
    try {
        const newNewsEvent = models.NewsEvent.build(newsEventData);
        const savedNewsEvent = await newNewsEvent.save();
        return savedNewsEvent;
    } catch (error) {
        throw new Error(`Error creating news/event: ${error.message}`);
    }
};

async function getNewsEventById(id_news_event) {
    try {
        const newsEvent = await models.NewsEvent.findOne({
            where: {
                id_news_event: id_news_event
            },
        });

        return newsEvent;

    } catch (error) {
        throw new Error(`Error getting news/event by id: ${error.message}`);
    }
};

async function getAllNewsEvents() {
    try {
        const newsEvents = await models.NewsEvent.findAll();
        return newsEvents;
    } catch (error) {
        throw new Error(`Error getting all news/events: ${error.message}`);
    }
};

async function updateNewsEvent(id_news_event, newsEventData) {
    try {
        const newsEvent = await models.NewsEvent.findByPk(id_news_event);
        if (!newsEvent) {
            throw new Error('News/Event not found');
        }
        await newsEvent.update(newsEventData);
        return newsEvent.toJSON();
    } catch (error) {
        throw new Error(`Error updating news/event: ${error.message}`);
    }
};

async function deleteNewsEvent(id_news_event) {
    try {
        const newsEvent = await models.NewsEvent.findByPk(id_news_event);
        if (!newsEvent) {
            throw new Error('News/Event not found');
        }
        await newsEvent.destroy();
        return true;
    } catch (error) {
        throw new Error(`Error deleting news/event: ${error.message}`);
    }
};

module.exports = {
    createNewsEvent,
    getNewsEventById,
    getAllNewsEvents,
    updateNewsEvent,
    deleteNewsEvent
};
