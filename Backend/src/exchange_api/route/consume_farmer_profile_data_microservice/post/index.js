const appErr = require("this_pkg/error");
const axios = require("axios");
const { frontend_host, app_url } = require("cccommon/config");
const { clienteAxios } = require("../../../axios/clienteAxios.js");

const domain = app_url()

exports.handler = async (req, res) => {

  const body = { ...req.body, url: domain }

  try {
    const { data } = await clienteAxios.post(
      "/consume_farmer_profile_data_microservice", body
    );

    if (data.status === "failed") {
      return res.status(400).json({ ok: false, msg: data.error_message })
    }

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: "Hubo un error al comunicar con datos" })
  }

};
