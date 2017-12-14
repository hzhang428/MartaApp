var getConnection = require('./db.js');
var mySQL = require('mysql');

/*
 * Get random integer in the range of [min, max)
 */
function getRandomInt(min, max) {
    var min = Math.ceil(min);
    var max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

/*
 * Generate a random 16 digit card number 
 */ 
function generateNewCardNumber() {
    var number = "";
    for (let i = 0; i < 16; i++) {
        number += getRandomInt(0, 10);
    }
    return number;
}

/*
 * SQL statement to insert a new breezecard record
 * if owner is null, card won't be assigned
 * value is default to be zero
 */
function createNewCardStatement(owner, cardNumber) {
    var sql = "INSERT INTO " + 
              "BreezeCard " + 
              "(??) " + 
              "VALUES " + 
              "(?, ?, ?)";
    var columns = ["BelongsTo", "CardNumber", "Value"];
    return mySQL.format(sql, [columns, owner, cardNumber, 0]); 
}

/*
 * SQL statement that check if a card number exist in the breezecard table
 */
function checkExistenceStatement(cardNumber) {
    var sql = "SELECT 1 FROM BreezeCard WHERE CardNumber = ?"
    return mySQL.format(sql, cardNumber);
}

/*
 * SQL statement to Update breezecard BelongsTo, and Value column
 */
function updateCardInfoStatement(cardNumber, newOwner, value) {
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

/*
 * SQL statement to find breezecard based on the
 * input card number
 */
function getCardByIDStatement(cardNumber) {
    var sql = "SELECT " + 
                "* " + 
                "FROM " + 
                "BreezeCard " + 
                "WHERE " + 
                "CardNumber = ?";
    return mySQL.format(sql, cardNumber);
}

/*
 * insert a new record given owner and card number in the breezecard table
 */
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

/*
 * randomly generate card number and check if it exists in the breezecard table
 * it not call createNewCard method to insert the record
 * if not generate random card number until the number does exist in the 
 * breezecard table
 */
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

/*
 * Generate SQL statement based on the input parameters
 * if showConflict is true, card that's in the conflict table won't be returned
 * lower and higher values stands for the value range of the breezecard
 */
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

    findByID: function(params, callback) {
        getConnection(function(err, con) {
            if (err) {
                callback(err, null);
            } else {
                var sql = getCardByIDStatement(params);
                con.query(sql, function(err, BreezeCard) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, BreezeCard);
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
                var sql = updateCardInfoStatement(cardNumber, newOwner, value);
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