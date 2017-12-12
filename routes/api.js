var express = require('express');
var router = express.Router();
var StationController = require('../controllers/StationController')

router.get('/:resource', function(req, res, next) {
    var resource = req.params.resource;
    if (resource == 'station') {
        StationController.find(req.query, function(err, results) {
            if (err) {
                res.json({
                    confirmation: "fail",
                    message: err
                });
            } else {
                res.json({
                    confirmation: "success",
                    message: results
                });
            }
        });
    } 
});

router.get('/:resource/:stopID', function(req, res, next) {
    var resource = req.params.resource;
    var stopID = req.params.stopID;

    if (resource == 'station') {
        StationController.findById(stopID, function(err, result) {
            if (err) {
                res.json({
                    confirmation: "fail",
                    message: err
                });
            } else {
                res.json({
                    confirmation: "success",
                    message: result
                });
            }
        });
    } 
});

router.post('/:resource', function(req, res, next) {
    var resource = req.params.resource;

    if (resource == 'station') {
        StationController.create(req.body, function(err, result) {
            if (err) {
                res.json({
                    confirmation: "fail",
                    message: err.message
                });
            } else {
                res.json({
                    confirmation: "success",
                    message: result
                });
            }
        });
    }
});

module.exports = router