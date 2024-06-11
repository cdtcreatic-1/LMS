const axios = require("axios");

const clienteAxios = axios.create({
  baseURL: "http://green_trade_python_service:5020",
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = { clienteAxios };
