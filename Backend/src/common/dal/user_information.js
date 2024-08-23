const models = require("cccommon/models/internaldb");

// Fill in the fields for the new user in user_information using models.user_information.build
async function createuser_information(
  id_user,
  id_type_of_information,
  user_personal_description_text
) {
  try {
    const newuser_information = models.user_information.build({
      id_user: id_user,
      id_type_of_information: id_type_of_information,
      user_personal_description_text: user_personal_description_text,
    });
    const saveduser_information = await newuser_information.save();
    return saveduser_information;
  } catch (error) {
    throw new Error(`Error creating user_information: ${error.message}`);
  }
}

// Update the fileds for the user in user_information using models.UserDocumentation.update using user_id
async function updateuser_information(
  id_user,
  id_type_of_information,
  user_personal_description_text,
  id_user_information
) {
  try {
    const [affectedRows, [updatedRecord]] =
      await models.user_information.update(
        {
          id_user,
          id_type_of_information,
          user_personal_description_text,
        },
        {
          where: { id_user_information },
          returning: true,
        }
      );

    if (affectedRows === 0) {
      return null;
    }
    return updatedRecord;
  } catch (err) {
    throw new Error(`Error updating user information: ${err.message}`);
  }
}

async function updateuser_information_v2(
  id_user,
  id_type_of_information,
  user_personal_description_text
) {
  try {
    const [affectedRows, [updatedRecord]] =
      await models.user_information.update(
        {
          id_user,
          id_type_of_information,
          user_personal_description_text,
        },
        {
          where: { id_user },
          returning: true,
        }
      );

    if (affectedRows === 0) {
      return null;
    }
    return updatedRecord;
  } catch (err) {
    throw new Error(`Error updating user information: ${err.message}`);
  }
}

async function getUser4ById(id_user) {
  try {
    const user = await models.user_information.findAll({
      where: {
        id_user: id_user,
      },
    });

    return user;
  } catch (error) {
    throw new Error(`Error getting user by id: ${error.message}`);
  }
}

async function getUser4ByIdUserAndIdTypeOfInformation(
  id_user,
  id_type_of_information,
  id_user_information
) {
  console.log({ id_user });
  console.log({ id_type_of_information });
  try {
    const user = await models.user_information.findAll({
      where: {
        id_user: id_user,
        id_type_of_information: id_type_of_information,
        id_user_information: id_user_information,
      },
    });
    console.log({ user });
    return user;
  } catch (error) {
    throw new Error(`Error getting user by id: ${error.message}`);
  }
}

async function getUserInformationByIdUserInformation(id_user_information) {
  try {
    const user = await models.user_information.findOne({
      where: {
        id_user_information: id_user_information,
      },
    });
    console.log({ user });
    return user;
  } catch (error) {
    throw new Error(`Error getting user by id: ${error.message}`);
  }
}

async function getUserInformationByIdUser(id_user) {
  try {
    const user = await models.user_information.findOne({
      where: {
        id_user,
      },
    });
    console.log({ user });
    return user;
  } catch (error) {
    throw new Error(`Error getting user by id: ${error.message}`);
  }
}

module.exports = {
  createuser_information,
  getUser4ById,
  updateuser_information,
  getUser4ByIdUserAndIdTypeOfInformation,
  getUserInformationByIdUserInformation,
  getUserInformationByIdUser,
  updateuser_information_v2
};
