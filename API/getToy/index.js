var mysql = require('mysql');

exports.handler = function(event, context) {
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
            return context.fail("Can't connect to DB");
        }

        // Get the toy's UUID from the URL path
        var toyUUID = event.toyID;

        // Look up toy in DB
        connection.query('SELECT uuid, name, image_url, story, created FROM toys WHERE uuid = ? LIMIT 1', [toyUUID],
            function(err, results, fields) {
                if (err) {
                    connection.release();
                    pool.end()
                    return context.fail("Query failed: " + err);
                }

                connection.release();
                pool.end()

                if (!results.length) {
                    return context.fail("Toy not found");
                }

                var toy = results[0];
                return context.succeed(toy);
            });
    });
};
