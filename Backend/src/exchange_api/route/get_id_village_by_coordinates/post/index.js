const appErr = require('this_pkg/error');
const axios = require('axios');

exports.handler = async (req, res) => {

    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    axios.post(`http://python_service:5020/get_data_geoinformation_service`, {
        service: 'get_entities_ids_from_coordinate',
        longitude: longitude,
        latitude: latitude
    })
        .then(function (response) {

        res.status(200).send({
            message: 'Data received successfully',
            data: {
                id_state:response.data.id_state,
                id_city:response.data.id_city,
                id_village:response.data.id_village
            }
        });
    })
    .catch(function (error) {
        console.log(error);

        return res.status(500).send({
            message: 'Error getting data',
            data: error
        });

    }); 
};