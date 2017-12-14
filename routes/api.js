var express = require('express');
var router = express.Router();
var StationController = require('../controllers/StationController');
var BreezeCardController = require('../controllers/BreezeCardController');
var Controllers = require('../controllers');

router.get('/:resource', function(req, res, next) {
    var resource = req.params.resource;
    var controller = Controllers[resource];
    controller.find(req.query, function(err, results) {
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
});

router.get('/:resource/:stopID', function(req, res, next) {
    var resource = req.params.resource;
    var stopID = req.params.stopID;

    if (resource == 'station') {
        StationController.findByParameters(stopID, function(err, result) {
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
    var controller = Controllers[resource];    
    controller.create(req.body, function(err, result) {
        if (err) {
            res.json({
                confirmation: "fail",
                message: err.message
            });
        } else {
            res.json({
                confirmation: "success",
                message: "New " + resource + "created"
            });
        }
    });
});

router.put('/:resource', function(req, res, next) {
    var resource = req.params.resource;
    var controller = Controllers[resource];
    controller.update(req.body, function(err, result) {
        if (err) {
            res.json({
                confirmation: "fail",
                message: err.message
            });
        } else {
            res.json({
                confirmation: "success",
                message: resource + " updated"
            });
        }
    });
});

module.exports = router