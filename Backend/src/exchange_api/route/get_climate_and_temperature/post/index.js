const appErr = require('this_pkg/error');
const axios = require('axios');
const farmDal = require('cccommon/dal/farms_additional_info');

exports.handler = async (req, res) => {
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    let response;
    // console.log('latitudeFloat: ', latitudeFloat);
    // console.log('longitudeFloat: ', longitudeFloat);
    // axios.post()

    // console.log(process.env.python_service_host);
    // console.log(process.env.python_service_port);

    axios.post(`http://python_service:5020/get_data_geoinformation_service`, {
        service: 'get_information_from_coordinate',
        longitude: longitude,
        latitude: latitude
    })
    .then(function (response) {
        if(response.data.altitude == -99){
            // Error diciendo que la longitud y latitud están fuera del rango permitido
            return res.status(400).send({
                message: 'La longitud o latitud están fuera del rango permitido'
            });
        }
        return res.status(200).send({
            message: 'Data received successfully',
            data: response.data
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