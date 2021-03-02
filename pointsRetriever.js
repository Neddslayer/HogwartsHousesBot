const mongodb = require('mongodb');
const client = mongodb.MongoClient

var values = new Promise(function(resolve, reject) {
    // Use connect method to connect to the server
    client.connect(uri, function(err, client) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log("Connected to mongoDB server");

            // Select database
            const db = client.db('Data');

            // Get the documents collection
            var coll = db.collection('points');

            //We have a cursor now with our find criteria
            var cursor = coll.find({
                "query": "result"
            });

            //Lets iterate on the result
            cursor.each(function(err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Fetched:', doc);
                    resolve(doc);
                }
            });
        }
        // Close connection when done
        client.close();
    });
})

module.exports = values;
