var getConnecton = require('./db.js')

module.exports = {
    find: function(params, callback) {
        getConnecton(function(err, con) {
            if (err) {
                callback(err, null);
                return;
            } else {
                var sql = 'SELECT * FROM Station';
                con.query(sql, function(err, Stations) {
                    callback(null, Stations);
                    con.release();
                });
            }
        });
    }
}