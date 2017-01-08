var mysql = require('mysql');

function validURL(url) {
	var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(url);
}

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

        // Query params
        var toy_uuid = event.toyID;

        // Request body
        var hint = event.body.hint; // 1024
        var message = event.body.message; // 2048, optional
        var image_url = event.body.image_url; // 1024, optional
        var lat = event.body.lat; // -90 - 90
        var lon = event.body.lon; // -180 - 180

        // Check for required fields
        if (!hint || !lat || !lon) {
            connection.release();
            pool.end()
            return callback("Missing required fields", null);
        }

        // Check hint
        if (hint.length > 1024) {
            connection.release();
            pool.end()
            return callback("hint must be under 1024 characters", null);
        }

        // Check message
        if (message && message.length > 2048) {
            connection.release();
            pool.end()
            return callback("message must be under 2048 characters", null);
        }

        // Check image_url
        if (image_url && image_url.length > 1024) {
            connection.release();
            pool.end()
            return callback("image_url must be under 1024 characters", null);
        }

        // Validate image_url
        if (image_url && !validURL(image_url)) {
            connection.release();
            pool.end()
            return callback("image_url invalid", null);
        }

        // Check lat
        var latFloat = parseFloat(lat);
        if (!latFloat || latFloat == 0 || latFloat < -90 || latFloat > 90) {
            connection.release();
            pool.end()
            return callback("Invalid lat", null);
        }

        // Check lon
        var lonFloat = parseFloat(lon);
        if (!lonFloat || lonFloat == 0 || lonFloat < -180 || lonFloat > 180) {
            connection.release();
            pool.end()
            return callback("Invalid lon", null);
        }

        // Move toy
        connection.query('INSERT INTO toy_history (uuid, toy_uuid, hint, message, image_url, lat, lon, created) VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW())', [toy_uuid, hint, message, image_url, lat, lon], function(err, results, fields) {
            if (err) {
                connection.release();
                pool.end()
                return callback("Query failed: " + err, null);
            }

            var objectID = results.insertId;

            // Get UUID of row we just created
            connection.query('SELECT uuid FROM toy_history WHERE id = ?', [objectID], function(err, results, fields) {
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
