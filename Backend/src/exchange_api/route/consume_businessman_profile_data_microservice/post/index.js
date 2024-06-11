const appErr = require("this_pkg/error");
const axios = require("axios");
const { frontend_host, app_url } = require("cccommon/config");
const { clienteAxios } = require("../../../axios/clienteAxios.js");

exports.handler = async (req, res) => {
  const { microservice } = req.body;

  switch (microservice) {
    case "get_products_by_filtered_search": //✅
      const { lot_properties, price_range, id_state } = req.body;

      try {
        const { data } = await clienteAxios.post(
          "/consume_businessman_profile_data_microservice",
          {
            microservice,
            lot_properties,
            price_range,
            id_state,
          }
        );

        const resul = data.lots_information.map((l) => {
          return {
            ...l,
            lot_photo: `${app_url()}${l.lot_photo}`,
          };
        });

        return res.status(200).send({
          message: "Data received successfully",
          data: resul,
        });
      } catch (error) {
        console.log(error);

        return res.status(500).send({
          message: "Error getting data",
          data: error,
        });
      }

      break;
    case "get_lot_information": //✅
      const { id_lot } = req.body;

      clienteAxios
        .post("/consume_businessman_profile_data_microservice", {
          microservice,
          id_lot,
        })
        .then(function (response) {
          return res.status(200).send({
            message: "Data received successfully",
            data: response.data,
          });
        })
        .catch(function (error) {
          console.log(error);

          return res.status(500).send({
            message: "Error getting data",
            data: error,
          });
        });

      break;
    case "get_available_items_for_lots": //✅
      clienteAxios
        .post("/consume_businessman_profile_data_microservice", {
          microservice,
        })
        .then(function (response) {
          return res.status(200).send({
            message: "Data received successfully",
            data: response.data,
          });
        })
        .catch(function (error) {
          console.log(error);

          return res.status(500).send({
            message: "Error getting data",
            data: error,
          });
        });
      break;
    case "get_farmer_trends": //✅
      clienteAxios
        .post("/consume_businessman_profile_data_microservice", {
          microservice,
        })
        .then(function (response) {
          return res.status(200).send({
            message: "Data received successfully",
            data: response.data,
          });
        })
        .catch(function (error) {
          console.log(error);

          return res.status(500).send({
            message: "Error getting data",
            data: error,
          });
        });

      break;
  }
};
