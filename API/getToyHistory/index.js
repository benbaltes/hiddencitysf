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

        // Look up the toy's history
        connection.query('SELECT hint, message, image_url, lat, lon, created, user_name FROM toy_history WHERE toy_uuid = ? ORDER BY created DESC', [toyUUID],
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

                return callback(null, history);
            });
    });
};
