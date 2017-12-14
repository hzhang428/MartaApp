var express = require('express');
var router = express.Router();
var Controllers = require('../controllers');

router.get('/:resource', function(req, res, next) {
    var resource = req.params.resource;
    var controller = Controllers[resource];

    if (controller == null) {
        res.json({
            confirmation: "fail",
            message: "Invalid resource: " + resource
        });
        return;
    }

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

router.get('/:resource/:id', function(req, res, next) {
    var resource = req.params.resource;
    var id = req.params.id;
    var controller = Controllers[resource];

    if (controller == null) {
        res.json({
            confirmation: "fail",
            message: "Invalid resource: " + resource
        });
        return;
    }

    controller.findByID(id, function(err, result) {
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
});

router.post('/:resource', function(req, res, next) {
    var resource = req.params.resource;
    var controller = Controllers[resource];    

    if (controller == null) {
        res.json({
            confirmation: "fail",
            message: "Invalid resource: " + resource
        });
        return;
    }

    controller.create(req.body, function(err, result) {
        if (err) {
            res.json({
                confirmation: "fail",
                message: err.message
            });
        } else {
            res.json({
                confirmation: "success",
                message: "New " + resource + " created"
            });
        }
    });
});

router.put('/:resource', function(req, res, next) {
    var resource = req.params.resource;
    var controller = Controllers[resource];

    if (controller == null) {
        res.json({
            confirmation: "fail",
            message: "Invalid resource: " + resource
        });
        return;
    }

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