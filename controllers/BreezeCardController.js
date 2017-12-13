var getConnection = require('./db.js')
var mySQL = require('mysql')

module.exports = {
    find: function(params, callback) {
        var showConflict = params.showconflict;
        // console.log(params);
        getConnection(function(err, con) {
            if (err) {
                callback(err, null);
            } else {
                if (showConflict === 'true') {
                    var sql = "SELECT " + 
                              "* " + 
                              "FROM " + 
                              "BreezeCard";
                    con.query(sql, function(err, BreezeCards) {
                        callback(null, BreezeCards);
                        con.release();
                    });
                } else {
                    var sql = "SELECT " + 
                              "A.CardNumber, A.Value, A.BelongsTo " + 
                              "FROM " + 
                              "BreezeCard AS A " + 
                              "WHERE " + 
                              "A.CardNumber " + 
                              "NOT IN " + 
                              "(SELECT B.CardNumber FROM Conflict AS B)";
                    con.query(sql, function(err, BreezeCards) {
                        callback(null, BreezeCards);
                        con.release();
                    });
                }
            }
        });
    },
}