const mongo = require('mongodb');
const client = mongo.MongoClient;
const uri = process.env.DB_URI;
var db;
var collection;
db = client.db('Data');
collection = db.collection('points');
var updateVal = {};

function newPoints(house, amount) {
	client.connect(uri, function(err, client) {
		if(err){console.log('[Bot/WARN] Unable to connect to the mongoDB server. Error:', err);}
        	
        	console.log("[Server/INFO] Connected to mongoDB server to update value");
		
		updateVal[house] = amount
		
 		console.log(updateVal);
			
	  	collection.updateOne({ "query" : "result" }, { $set: updateVal});
		console.log("[Server/INFO] Successfully updated 1 document");
        	
	})
}

function modRaven(amount) {
	client.connect(uri, function(err, client) {
        	if (err) {
        	    console.log('[Bot/WARN] Unable to connect to the mongoDB server. Error:', err);
        	} else {
        	    console.log("[Server/INFO] Connected to mongoDB server to update value");
		
            	    // Select database
        	    const db = client.db('Data');

         	   // Get the documents collection
         	   var coll = db.collection('points');
		   
	  	   coll.updateOne({ "query" : "result" }, { $inc: { "ravenclaw": parseFloat(amount) } });
		   console.log("[Server/INFO] Successfully updated 1 document");
        	}
        // Close connection when done
        client.close();
     });
}
function modHuffle(amount) {
	client.connect(uri, function(err, client) {
        	if (err) {
        	    console.log('[Bot/WARN] Unable to connect to the mongoDB server. Error:', err);
        	} else {
        	    console.log("[Server/INFO] Connected to mongoDB server");
		
            	    // Select database
        	    const db = client.db('Data');

         	   // Get the documents collection
         	   var coll = db.collection('points');
		   
	  	   coll.updateOne({ "query" : "result" }, { $inc: { "hufflepuff": parseFloat(amount) } });
		   console.log("[Server/INFO] Successfully updated 1 document");
        	}
        // Close connection when done
        client.close();
     });
}
function modSlyther(amount) {
	client.connect(uri, function(err, client) {
        	if (err) {
        	    console.log('[Bot/WARN] Unable to connect to the mongoDB server. Error:', err);
        	} else {
        	    console.log("[Server/INFO] Connected to mongoDB server");
		
            	    // Select database
        	    const db = client.db('Data');

         	   // Get the documents collection
         	   var coll = db.collection('points');
		   
	  	   coll.updateOne({ "query" : "result" }, { $inc: { "slytherin": parseFloat(amount) } });
		   console.log("[Server/INFO] Successfully updated 1 document");
        	}
        // Close connection when done
        client.close();
     });
}
function modGryffin(amount) {
	client.connect(uri, function(err, client) {
        	if (err) {
        	    console.log('[Bot/WARN] Unable to connect to the mongoDB server. Error:', err);
        	} else {
        	    console.log("[Server/INFO] Connected to mongoDB server");
		
            	    // Select database
        	    const db = client.db('Data');

         	   // Get the documents collection
         	   var coll = db.collection('points');
		   
	  	   coll.updateOne({ "query" : "result" }, { $inc: { "gryffindor": parseFloat(amount) } });
		   console.log("[Server/INFO] Successfully updated 1 document");
        	}
        // Close connection when done
        client.close();
     });
}
module.exports = { modRaven, modHuffle, modSlyther, modGryffin };
