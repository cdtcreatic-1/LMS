const associationsDal = require('cccommon/dal/associations');
const roastingTypeDal = require('cccommon/dal/roasting_type');
const coffeeVariationsDal = require('cccommon/dal/coffee_variations');
const coffeeProfilesDal = require('cccommon/dal/coffee_profile');
const appErr = require('this_pkg/error');


exports.handler = async (req, res) => {

    const successStatus = 201;
    let associations = [];
    let roastingTypes = [];
    let coffeeVariations = [];
    let coffeeProfiles = [];



    try {

        associations = await associationsDal.getAllAssociations();
        if (!associations) {
            appErr.send(req, res, 'associations_not_found', 'Associations not found');
            return;
        }

        roastingTypes = await roastingTypeDal.getAllRoastingTypes();
        if (!roastingTypes) {
            appErr.send(req, res, 'roasting_types_not_found', 'Roasting types not found');
            return;
        }

        coffeeVariations = await coffeeVariationsDal.getAllCoffeeVariations();
        if (!coffeeVariations) {
            appErr.send(req, res, 'coffee_variations_not_found', 'Coffee variations not found');
            return;
        }

        coffeeProfiles = await coffeeProfilesDal.getAllCoffeeProfiles();
        if (!coffeeProfiles) {
            appErr.send(req, res, 'coffee_profiles_not_found', 'Coffee profiles not found');
            return;
        }

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to get coffee info data');
        return;
    }

    res.status(successStatus).send({
        message: 'User created successfully',
        associations: associations,
        roastingTypes: roastingTypes,
        coffeeVariations: coffeeVariations,
        coffeeProfiles: coffeeProfiles
    });

};