const appErr = require("this_pkg/error");
const axios = require("axios");
const { frontend_host, app_url } = require("cccommon/config");
const userDal = require("cccommon/dal/user.js")
const { clienteAxios } = require("../../../axios/clienteAxios.js");

exports.handler = async (req, res) => {

    const domain = app_url();

    try {
        const { data } = await clienteAxios.post(
            "/consume_learner_profile_data_microservice",
            { ...req.body, url: domain }
        );

        if (data?.learning_style) {
            await userDal.updateUserLearningStyle(req.body.id_user, data.learning_style);
        }

        if (data?.chart_path) {
            data.chart_path = `${domain}charts/${data.chart_path}`;
        }

        if (data?.certificate_file_path) {
            data.certificate_file_path = `${domain}charts/${data.certificate_file_path}`
        }

        if (data.status === "failed") {
            return res.status(400).json({ ok: false, msg: data.error_message })
        }

        res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }

};
