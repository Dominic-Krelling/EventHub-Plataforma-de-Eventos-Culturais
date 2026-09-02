var express = require('express');
var router = express.Router();
const { success } = require('../middlewares/apiResponse');

router.get('/', (req, res) => {
    return success(res, {
        name: 'EventHub API',
        version: '1.0.0',
        status: 'online'
    }, 'Bem-vindo a API do EventHub.');
});

module.exports = router;