var getConnecton = require('./db.js')
var mySQL = require('mysql')

module.exports = {
    find: function(params, callback) {
        getConnecton(function(err, con) {
            if (err) {
                callback(err, null);
            } else {
                var sql = 'SELECT * FROM Station';
                con.query(sql, function(err, Stations) {
                    callback(null, Stations);
                    con.release();
                });
            }
        });
    },

    findByID: function(params, callback) {
        getConnecton(function(err, con) {
            if (err) {
                callback(err, null);
            } else {
                // console.log(params);
                var columns = []
                var sql = 'SELECT ' + 
                          'A.StopID, A.Name, A.EnterFare, A.IsTrain, A.Status, B.Intersection ' +
                          'FROM ' + 
                          'Station AS A ' + 
                          'LEFT JOIN ' + 
                          'BusStationIntersection AS B ' + 
                          'ON ' + 
                          'A.StopID = B.StopID ' + 
                          'WHERE ' + 
                          'A.StopID = ?';
                con.query(sql, [params], function(err, Station) {
                    if (err) {
                        callback(err, null);
                    } else {
                        // console.log(Station);
                        callback(null, Station);
                        con.release();
                    }
                });
            }
        });
    },

    create: function(params, callback) {
        getConnecton(function(err, con) {
            if (err) {
                callback(err, null);
            } else {
                // console.log(params);
                var stopid = params.stopid;
                var name = params.name;
                var fare = +params.enterfare;
                var istrain = params.istrain? 1 : 0;
                var status = params.isclosed? 1 : 0;

                var columns = ["StopID", "Name", "EnterFare", "IsTrain", "Status"];
                var sql = "INSERT INTO " + 
                          "Station " + 
                          "(??) " + 
                          "VALUES " + 
                          "(?, ?, ?, ?, ?)";

                con.query(sql, [columns, stopid, name, fare, istrain, status], function(err, result) {
                    if (err) {
                        callback(err, null);
                    } else {
                        // console.log(result);
                        callback(null, result);
                        con.release();
                    }
                })
            }
        })
    },

    update: function(params, callback) {
        getConnecton(function(err, con) {
            if (err) {
                callback(err, null);
            } else {
                var stopid = params.stopid;
                var fare = +params.enterfare;
                var status = params.isclosed? 1 : 0;
                var sql = "UPDATE Station " + 
                          "SET " + 
                          "EnterFare = ?, Status = ? " + 
                          "WHERE " + 
                          "StopID = ?";

                con.query(sql, [fare, status, stopid], function(err, result) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, result);
                        con.release();
                    }
                })
            }
        })
    }
};