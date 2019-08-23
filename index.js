/**
 * **Azure Cloud Function: Sends IoT Hub messages to MongoDB API CosmosDB**
 *  @param context object used for receiving and sending binding data, logging, and communicating with the runtime.
 *  @param IoTHubMessage message from the IoT hub
 */
module.exports = (context, IoTHubMessage) => {

	try {

		var config = require("./config");
		var dbName = config.dbName;
		var collectionName = config.collectionName;
		var conn = config.connectionString;

		context.log(`JS IoT Hub trigger called on: ${JSON.stringify(IoTHubMessage)}`);

		// Mongo Client
		var mongoClient = require("mongodb").MongoClient;
		context.log('MongoClient created');

		mongoClient.connect(conn, { useNewUrlParser: true, authSource: dbName }, (error, client) => {

			if (error) {
				context.log(`Error occurred while connecting to Cosmos MongoDB ${err}`)
			} else {
				context.log('Mongo Client connected to DB');
			}

			var collection = client.db(dbName).collection(collectionName);
			context.log('MongoClient collection retreived');
			collection.insertOne(IoTHubMessage, { w: 1 });
			client.close();
			context.log(`IoT Message saved to CosmosDB: ${JSON.stringify(IoTHubMessage)}`);
			context.done();

		});

	} catch (error) {
		context.log(`Error ${error}`);
	}

	context.log('Done!');
	context.done();

}