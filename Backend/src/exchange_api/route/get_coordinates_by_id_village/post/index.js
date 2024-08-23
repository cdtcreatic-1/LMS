const appErr = require('this_pkg/error');
const axios = require('axios');

exports.handler = async (req, res) => {

    const id_state = req.body.id_state;
    const id_city = req.body.id_city;
    const id_village = req.body.id_village;

    axios.post(`http://python_service:5020/get_data_geoinformation_service`, {
        service: 'get_geoinformation_from_polygon',
        id_state: id_state,
        id_city: id_city,
        id_village: id_village
    })
        .then(function (response) {

        res.status(200).send({
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