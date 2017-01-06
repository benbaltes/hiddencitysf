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

    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            pool.end()
            return callback("Can't connect to DB", null);
        }

        //Request body
        var pokemonID = event.body.pokemonID;
        var lat = event.body.lat;
        var lon = event.body.lon;
        var dateSpotted = event.body.dateSpotted;

        //Check for required fields
        if (!pokemonID || !lat || !lon || !dateSpotted) {
            connection.release();
            pool.end()
            return callback("Missing required fields", null);
        }

        //Check lat
        var latFloat = parseFloat(lat);
        if (!latFloat || latFloat == 0 || latFloat < -90 || latFloat > 90) {
            connection.release();
            pool.end()
            return callback("Invalid lat", null);
        }

        //Check lon
        var lonFloat = parseFloat(lon);
        if (!lonFloat || lonFloat == 0 || lonFloat < -180 || lonFloat > 180) {
            connection.release();
            pool.end()
            return callback("Invalid lon", null);
        }

        //Update user
        connection.query('INSERT INTO l ?, NOW())', [uuid, pokemonID, lat, lon, dateSpotted], function(err, results, fields) {
            if (err) {
                connection.release();
                pool.end()
                return callback("Query failed: " + err, null);
            }

            var objectID = results.insertId;

            connection.query('SELECT uuid FROM pokemon_locations WHERE id = ?', [objectID], function(err, results, fields) {
                if (err) {
                    connection.release();
                    pool.end();
                    return callback("Query failed: " + err, null);
                }

                if (!results.length) {
                    connection.release();
                    pool.end();
                    return context.fail("Error finding object");
                }

                connection.release();
                pool.end();
                return context.succeed({
                    uuid: results[0].uuid
                });
            });
        });
    });
};
