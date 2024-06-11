const userDal = require("cccommon/dal/user");
const stateDal = require("cccommon/dal/states");
const countryDal = require("cccommon/dal/countries");
const farmsDal = require("cccommon/dal/farms");
const FarmDocumentationDal = require("cccommon/dal/farm_documentation");
const userSkillPreferencesDal = require("cccommon/dal/user_skill_preferences");
const appErr = require("this_pkg/error");
const { frontend_host, app_url } = require("cccommon/config");

exports.handler = async (req, res) => {
  // Get user_id from params
  const id_user = Number(req.params.id_user);
  if (!id_user) {
    appErr.send(req, res, "validation_error", "Missing id_user");
    return;
  }

  try {
    // Get user from database
    const userFound = await userDal.getUserByIdUser(id_user);

    // Check if user exists
    if (!userFound) {
      appErr.send(req, res, "user_not_found", "User not found");
      return;
    }

    delete userFound.user_password;

    // Check for profile photo
    if (userFound?.user_profile_photo) {
      userFound.user_profile_photo = app_url() + userFound.user_profile_photo;
    } else {
      userFound.user_profile_photo = null;
    }

    // Check for cover photo
    if (userFound.dataValues?.user_cover_photo) {
      userFound.user_cover_photo = app_url() + userFound.user_cover_photo;
    } else {
      userFound.user_cover_photo = null;
    }

    const farmsData = await farmsDal.getFarmsByIdUser(id_user);
    let hasDocumentation = false;

    console.log("id_user: " + id_user);
    console.log(farmsData);

    const farmDoc = await FarmDocumentationDal.getFarmDocumentationByUserId(
      id_user
    );

    if (farmDoc) {
      hasDocumentation = true;
    }

    userFound.hasDocumentation = hasDocumentation;
    if (userFound?.id_state) {
      const id_state = userFound.id_state;
      const countryInfo = await stateDal.getCountryWithIdState(id_state);
      const id_country = countryInfo[0].id_country;
      const countryName = await countryDal.getCountriesByIdCountry(id_country);
      userFound.user_country = countryName[0].country_name_en;
      userFound.id_country = countryName[0].id_country;
    }

    console.log("hasDocumentation: " + hasDocumentation);
    console.log(userFound);

    const resultado = await userDal.getUserLearningStyle(id_user);

    if (resultado !== "" && resultado !== null) {
      const { learning_style } = resultado;

      if (learning_style !== null || learning_style !== "") {
        userFound.learning_style = learning_style;
      } else {
        userFound.learning_style = "";
      }
    } else {
      userFound.learning_style = "";
    }

    const user_skills = await userSkillPreferencesDal.getUserSkillsByUserId(id_user)
    userFound.skills = user_skills;

    // Send user data
    res.status(200).json(userFound);
  } catch (error) {
    appErr.handleRouteServerErr(req, res, error, "failed to get user by id");
    return;
  }
};
