const models = require('cccommon/models/internaldb');

async function getscoreLotsByIdLots(id_lot) {
    try {
        const scoreLots = await models.ScoreLots.findAll({
            where: {
                id_lot: id_lot
            }
        });
        return scoreLots;
    } catch (error) {
        throw new Error(`Error getting score users: ${error.message}`);
    }
}

async function getAllScoreLots() {
    try {
        const scoreLots = await models.ScoreLots.findAll();

        const dataOrder = [];
        scoreLots.forEach((scoreLot) => {
            let id_lot = scoreLot.dataValues['id_lot']
            if (id_lot in dataOrder) {
                dataOrder[id_lot]['id_score_lots'].push(scoreLot.dataValues['id_score_lots'])
                dataOrder[id_lot]['id_user'].push(scoreLot.dataValues['id_user'])
                dataOrder[id_lot]['score'].push(scoreLot.dataValues['score'])
            } else {
              dataOrder[id_lot] = {
                'id_lot': scoreLot.dataValues['id_lot'],
                'id_score_lots': [scoreLot.dataValues['id_score_lots']],
                'id_user': [scoreLot.dataValues['id_user']],
                'score': [scoreLot.dataValues['score']]
            }
          }
    
        });
    
        const filteredScore = dataOrder.filter((scoreLot) => scoreLot !== null);

        return filteredScore;
    } catch (error) {
        throw new Error(`Error getting score users: ${error.message}`);
    }
}

async function getscoreLotsByIdUsers(id_user) {
    try {
        const scoreLots = await models.ScoreLots.findAll({
            where: {
                id_user: id_user
            }
        });
        return scoreLots;
    } catch (error) {
        throw new Error(`Error getting score users: ${error.message}`);
    }
}

async function getscoreLotsByIdLotsAndIdUsers(id_lot, id_users) {
    try {
        const scoreLots = await models.ScoreLots.findAll({
            where: {
                id_lot: id_lot,
                id_user: id_user
            }
        });
        return scoreLots;
    } catch (error) {
        throw new Error(`Error getting score users: ${error.message}`);
    }
}

async function saveScoreLots(scoreLots) {
    try {
        const scoreLotsSaved = await models.ScoreLots.build(scoreLots);
        await scoreLotsSaved.save();
        return scoreLotsSaved;
    } catch (error) {
        throw new Error(`Error saving score users: ${error.message}`);
    }
}

async function updateScoreLots(scoreLots) {
    try {
        const scoreLotsUpdated = await models.ScoreLots.update(scoreLots, {
            where: {
                id_lot: scoreLots.id_lot,
                id_user: scoreLots.id_user
            }
        });
        return scoreLotsUpdated;
    } catch (error) {
        throw new Error(`Error updating score users: ${error.message}`);
    }
}

async function deleteScoreLots(id_lot) {

    try {
        const scoreLotsDeleted = await models.ScoreLots.destroy({
            where: {
                id_lot: id_lot
            },
        });
        return scoreLotsDeleted;
    } catch (error) {
        throw new Error(`Error deleting scores for lot: ${err.message}`);
    }
}

module.exports = {
    getscoreLotsByIdLots,
    getscoreLotsByIdUsers,
    getscoreLotsByIdLotsAndIdUsers,
    saveScoreLots,
    updateScoreLots,
    deleteScoreLots,
    getAllScoreLots
};