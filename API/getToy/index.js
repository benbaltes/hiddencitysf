var mysql = require('mysql');

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

        // Get the toy's UUID from the URL path
        var toyUUID = event.toyID;

        // Look up toy in DB
        connection.query('SELECT uuid, name, image_url, story, created FROM toys WHERE uuid = ? LIMIT 1', [toyUUID],
            function(err, results, fields) {
                if (err) {
                    connection.release();
                    pool.end()
                    return callback("Query failed: " + err, null);
                }

                if (!results.length) {
                    connection.release();
                    pool.end()
                    return callback("Toy not found", null);

                }

                var toy = results[0];

                // Look up the toy's most recent location
                connection.query('SELECT hint, message, image_url, lat, lon, created, user_name FROM toy_history WHERE toy_uuid = ? ORDER BY created DESC LIMIT 1', [toyUUID],
                    function(err, history, fields) {
                        if (err) {
                            connection.release();
                            pool.end()
                            return callback("Query failed: " + err, null);
                        }

                        connection.release();
                        pool.end()

                        if (!history.length) {
                            return callback("Toy has no history", null);
                        }

                        var location = history[0];
                        toy.location = location;
                        return callback(null, toy);
                    });
            });
    });
};
