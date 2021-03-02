const mongo = require('mongodb');
const client = mongo.MongoClient;
const info = "[Bot/INFO] "
const warn = "[Bot/WARN] "
//no more hacking for you silly boi
const uri = process.env.DB_URI;

function modDB(house, amount) {
	client.connect(uri, function(err, client) {
        	if (err) {
        	    console.log('Unable to connect to the mongoDB server. Error:', err);
        	} else {
        	    console.log("Connected to mongoDB server");
		
            	    // Select database
        	    const db = client.db('Data');

         	   // Get the documents collection
         	   var coll = db.collection('points');
		   
	  	   coll.updateOne({ "query" : "result" }, { $inc: { "house": Number(amount) } });
        	}
        // Close connection when done
        client.close();
     });
}
module.exports = { modDB };
