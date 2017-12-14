var getConnection = require('./db.js');
var mySQL = require('mysql');

function getRandomInt(min, max) {
    var min = Math.ceil(min);
    var max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateNewCardNumber() {
    var number = "";
    for (let i = 0; i < 16; i++) {
        number += getRandomInt(0, 10);
    }
    return number;
}

function createNewCardStatement(owner, cardNumber) {
    var sql = "INSERT INTO " + 
              "BreezeCard " + 
              "(??) " + 
              "VALUES " + 
              "(?, ?, ?)";
    var columns = ["BelongsTo", "CardNumber", "Value"];
    return mySQL.format(sql, [columns, owner, cardNumber, 0]); 
}

function checkExistenceStatement(cardNumber) {
    var sql = "SELECT 1 FROM BreezeCard WHERE CardNumber = ?"
    return mySQL.format(sql, cardNumber);
}

function createNewCard(owner, cardNumber, connection, callback) {
    var sql = createNewCardStatement(owner, cardNumber);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            // console.log(result);
            callback(null, result);
            connection.release();
        }
    });
}

function checkExistAndCreate(owner, connection, callback) {
    var cardNumber = generateNewCardNumber();
    var checkStatement = checkExistenceStatement(cardNumber);
    connection.query(checkStatement, function(err, result) {
        if (err) {
            callback(err, null);
        } else if (result.length >= 1) {
            // console.log(result);
            checkExistAndCreate(owner, connection, callback);
        } else {
            createNewCard(owner, cardNumber, connection, callback);
        }
    });
}

function updateCardInfo(cardNumber, newOwner, value) {
    var sql = "UPDATE " + 
              "BreezeCard " + 
              "SET";
    if (newOwner) {
        sql += " BelongsTo = ?";
        sql = mySQL.format(sql, newOwner);
        if (value) {
            sql += ",";
        }
    }
    if (value) {
        sql += " Value = ?";
        sql = mySQL.format(sql, value);
    }

    sql += " WHERE CardNumber = ?";
    sql = mySQL.format(sql, cardNumber);
    return sql;
}

function getCardByParameters(cardNumber, lower, higher, owner, showConflict) {
    // console.log(cardNumber);
    // console.log(lower);
    // console.log(higher);
    // console.log(owner);
    // console.log(showConflict);
    var sql;
    if (showConflict === 'true') {
        sql = "SELECT " + 
                "* " + 
                "FROM " + 
                "BreezeCard";
        if (!cardNumber && !lower && !higher && !owner) {
            return sql;
        }
        sql += " WHERE";
        if (cardNumber) {
            sql += " CardNumber = ?";
            sql = mySQL.format(sql, cardNumber);
            if (valueRange || owner) {
                sql += " AND";
            } else {
                return sql;
            }
        }
        if (lower || higher) {
            if (lower && higher) {
                sql += " Value >= ? AND Value <= ?";
                sql = mySQL.format(sql, [lower, higher]);
            } else if (lower) {
                sql += " Value >= ?";
                sql = mySQL.format(sql, lower);
            } else {
                sql += " Value <= ?";
                sql = mySQL.format(sql, higher);
            }
            if (owner) {
                sql += " AND";
            } else {
                return sql;
            }
        }
        if (owner) {
            sql += " BelongsTo = ?";
            sql = mySQL.format(sql, owner);
        }
        return sql;
    } else {
        sql = "SELECT " + 
                "A.CardNumber, A.Value, A.BelongsTo " + 
                "FROM " + 
                "BreezeCard AS A " + 
                "WHERE";
        if (cardNumber) {
            sql += " A.CardNumber = ? AND";
            sql = mySQL.format(sql, cardNumber);
        }
        if (lower || higher) {
            if (lower && higher) {
                sql += " A.Value >= ? AND A.Value <= ? AND";
                sql = mySQL.format(sql, [lower, higher]);
            } else if (lower) {
                sql += " A.Value >= ? AND";
                sql = mySQL.format(sql, lower);
            } else {
                sql += " A.Value <= ? AND";
                sql = mySQL.format(sql, higher);                
            }

        }
        if (owner) {
            sql += " A.BelongsTo = ? AND";
            sql = mySQL.format(sql, owner);
        }
        sql += " A.CardNumber " + 
                "NOT IN " + 
                "(SELECT B.CardNumber FROM Conflict AS B)";
        return sql;
    } 
}

module.exports = {
    find: function(params, callback) {
        var showConflict = params.showconflict;
        var lower = +params.lower;
        var higher = +params.higher;
        var cardNumber = params.cardnumber;
        var owner = params.owner;

        getConnection(function(err, con) {
            if (err) {
                callback(err, null);
            } else {
                var sql = getCardByParameters(cardNumber, lower, higher, owner, showConflict);
                // console.log(sql);
                con.query(sql, function(err, BreezeCards) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, BreezeCards);
                        con.release();
                    }
                });
            }
        });
    },

    update: function(params, callback) {
        var newOwner = params.newowner;
        var value = +params.value;
        var cardNumber = params.cardnumber;

        getConnection(function(err, con) {
            if (err) {
                callback(err, null);
            } else {
                var sql = updateCardInfo(cardNumber, newOwner, value);
                con.query(sql, function(err, result) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, result);
                        con.release();
                    }
                });
            }
        });
    },

    create: function(params, callback) {
        var owner = params.owner;
        getConnection(function(err, con) {
            if (err) {
                callback(err, null);
            } else {
                checkExistAndCreate(owner, con, callback);
            }
        });
    }
}