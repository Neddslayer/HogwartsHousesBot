const mongo = require('mongodb');
const client = mongo.MongoClient;
const info = "[Bot/INFO] "
const warn = "[Bot/WARN] "
//no more hacking for you silly boi
const uri = process.env.DB_URI;

function modDBRaven(house, amount) {
	client.connect(uri, function(err, client) {
        	if (err) {
        	    console.log('Unable to connect to the mongoDB server. Error:', err);
        	} else {
        	    console.log("Connected to mongoDB server");
		
            	    // Select database
        	    const db = client.db('Data');

         	   // Get the documents collection
         	   var coll = db.collection('points');
		   
	  	   coll.updateOne({ "query" : "result" }, { $inc: { "ravenclaw": amount } });
		   console.log("Int after parsing: " + amount);
        	}
        // Close connection when done
        client.close();
     });
}
function modDBHuffle(house, amount) {
	client.connect(uri, function(err, client) {
        	if (err) {
        	    console.log('Unable to connect to the mongoDB server. Error:', err);
        	} else {
        	    console.log("Connected to mongoDB server");
		
            	    // Select database
        	    const db = client.db('Data');

         	   // Get the documents collection
         	   var coll = db.collection('points');
		   
	  	   coll.updateOne({ "query" : "result" }, { $inc: { "hufflepuff": amount } });
        	}
        // Close connection when done
        client.close();
     });
}
function modDBSlyther(house, amount) {
	client.connect(uri, function(err, client) {
        	if (err) {
        	    console.log('Unable to connect to the mongoDB server. Error:', err);
        	} else {
        	    console.log("Connected to mongoDB server");
		
            	    // Select database
        	    const db = client.db('Data');

         	   // Get the documents collection
         	   var coll = db.collection('points');
		   
	  	   coll.updateOne({ "query" : "result" }, { $inc: { "slytherin": amount } });
        	}
        // Close connection when done
        client.close();
     });
}
function modDBGryffin(house, amount) {
	client.connect(uri, function(err, client) {
        	if (err) {
        	    console.log('Unable to connect to the mongoDB server. Error:', err);
        	} else {
        	    console.log("Connected to mongoDB server");
		
            	    // Select database
        	    const db = client.db('Data');

         	   // Get the documents collection
         	   var coll = db.collection('points');
		   
	  	   coll.updateOne({ "query" : "result" }, { $inc: { "gryffindor": amount } });
        	}
        // Close connection when done
        client.close();
     });
}
module.exports = { modDBRaven, modDBHuffle, modDBSlyther, modDBGryffin };
