var express = require('express');
var router = express.Router();

router.get('/:resource', function(req, res, next) {
    var resource = req.params.resource;
    if (resource == 'station') {
        res.json({
            confirmation: "success",
            message: "woo"
        });
    } else {

    }
});

module.exports = router