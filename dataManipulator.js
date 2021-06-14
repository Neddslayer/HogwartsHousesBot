const mongo = require('mongodb');
const client = mongo.MongoClient;
const uri = process.env.DB_URI;
var db;
var collection;
var updateVal = {};

function addPoints(house, amount) {
	client.connect(uri, function(err, client) {
		if(err){console.log('[Bot/WARN] Unable to connect to the mongoDB server. Error:', err);}
        	
        	console.log("[Server/INFO] Connected to mongoDB server to update value");
		
		db = client.db('Data');
		var houses;
		collection = db.collection('points');
		db.collection('points', function(err, collection) {
    			collection.find({}).toArray(function(err, results) {
        			houses = results;
        			console.log("Results: " + results);
				console.log("Houses: " + houses);
    			});
		});
		var newAmount;
		switch(house) {
			case 'ravenclaw':
			    newAmount = parseInt(houses[0]) + parseInt(amount);
			    break;
			case 'hufflepuff':
			    newAmount = parseInt(houses[1]) + parseInt(amount);
			    break;
			case 'slytherin':
			    newAmount = parseInt(houses[2]) + parseInt(amount);
			    break;
			case 'gryffindor':
			    newAmount = parseInt(houses[3]) + parseInt(amount);
			    break;
			case default:
			    //no way to pass messages to the bot in this script, so sets it to default
			    newAmount = parseInt(houses[0]) + parseInt(amount);
			    break;
		}
		
		updateVal[house] = newAmount
		
 		console.log(updateVal);
			
	  	//collection.updateOne({ "query" : "result" }, { $set: updateVal});
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
module.exports = { modRaven, modHuffle, modSlyther, modGryffin, addPoints };
