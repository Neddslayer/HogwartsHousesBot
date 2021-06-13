const mongo = require('mongodb');
const client = mongo.MongoClient;
//no more hacking for you silly boi
const uri = process.env.DB_URI;

function modPoints(amount, house) {
	client.connect(uri, function(err, client) {
		if (err) {
        	    console.log('[Bot/WARN] Unable to connect to the mongoDB server. Error:', err);
        	} else {
        	    console.log("[Server/INFO] Connected to mongoDB server to update value");
		
            	    // Select database
        	    const db = client.db('Data');

         	   // Get the documents collection
         	   var coll = db.collection('points');
		   
	  	   coll.updateOne({ "query" : "result" }, { $inc: { [house]: parseFloat(amount) } });
		   console.log("[Server/INFO] Successfully updated 1 document");
        	}
        // Close connection when done
        client.close();
     });
}

function modDBRaven(amount) {
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
function modDBHuffle(amount) {
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
function modDBSlyther(amount) {
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
function modDBGryffin(amount) {
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
module.exports = { modDBRaven, modDBHuffle, modDBSlyther, modDBGryffin };
