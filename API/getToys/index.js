var mysql = require('mysql');
var async = require('async');

exports.handler = function(event, context, callback) {
    var pool = mysql.createPool({
        connectionLimit: event.dbconnectionlimit,
        host: event.dbhost,
        port: event.dbport,
        user: event.dbuser,
        password: event.dbpassword,
        database: event.dbdatabase
    });

    // Connect to database
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            pool.end()
            return callback("Can't connect to DB", null);
        }

        // Look up toy in DB
        connection.query('SELECT uuid, name, image_url, story, created FROM toys',
            function(err, results, fields) {
                if (err) {
                    connection.release();
                    pool.end()
                    return callback("Query failed: " + err, null);
                }

                if (!results.length) {
                    connection.release();
                    pool.end()
                    return callback("No toys found", null);
                }

                var toys = [];

                //Iterate through each toy and get their last known location
                async.forEach(results, function(toy, callback) {

                    //Get history
                    connection.query('SELECT hint, message, image_url, lat, lon, created FROM toy_history WHERE toy_uuid = ? ORDER BY created DESC LIMIT 1', [toy.uuid], function(err, history, fields) {
                        if (err) {
                            connection.release();
                            pool.end()
                            return callback("Query failed: " + err, null);
                        }

                        var toyComplete = toy; // Create toy object
                        toyComplete.history = history;
                        toys.push(toyComplete); //Add toy to toys array
                        callback(); // Tell async that the iterator has completed
                    });

                }, function(err) {
                    connection.release();
                    pool.end()
                    return callback(null, toys);
                });
            });
    });
};
