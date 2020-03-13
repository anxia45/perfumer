var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
    res.send('购物车')
});

module.exports = router;