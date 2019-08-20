const config = require("./config");
var mongoClient = require("mongodb").MongoClient;

module.exports = (context, IoTHubMessages) =>{

	try {

		context.log(`JS IoT Hub trigger called on: ${JSON.stringify(IoTHubMessages)}`);

		var dbName = config.dbName;
		var collectionName = config.collectionName;

		// MongoDB client
		mongoClient.connect(config.connectionString,{useNewUrlParser: true, authSource: dbName}, (error, client) => {

			if(error){
				context.log(`Error occurred while connecting to DB: ${error}`);
			} else{
				context.log('MongoDB Client connected to DB');
			}

			var collection = client.db(dbName).collection(collectionName);
			context.log(`MongoDB Client collection retreived: ${collection}`);
			collection.insertOne(IoTHubMessages, {w: 1});
			client.close();
			context.log(`Message Saved to Cosmos MongoDB: ${JSON.stringify(IoTHubMessages)}`);
			context.done();

		});
  
    } catch (error){
      context.log(`Function Error: ${error}`);
    }
  
    context.log('Done!');
    context.done();

  };