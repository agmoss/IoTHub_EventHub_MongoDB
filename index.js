/**
 * **Azure Cloud Function: Sends IoT Hub messages to MongoDB API CosmosDB**
 *  @param context object used for receiving and sending binding data, logging, and communicating with the runtime.
 *  @param IoTHubMessage message from the IoT hub
 */
module.exports = (context, IoTHubMessage) => {
	
  try {

		//TODO: Import these
    var dbName = "putdbnamehere";
    var collectionName = "putcollectionnamehere";

    context.log(`JS IoT Hub trigger called on: ${JSON.stringify(IoTHubMessage)}`);

		// Mongo Client
    var mongoClient = require("mongodb").MongoClient;
    context.log('MongoClient created');

    var conn = "putconhere";

    mongoClient.connect(conn,{useNewUrlParser: true, authSource: dbName},  (error, client) => {

      if(error){
        context.log(`Error occurred while connecting to Cosmos MongoDB ${err}`)
      } else{
        context.log('Mongo Client connected to DB');
      }

      var collection = client.db(dbName).collection(collectionName);
      context.log('MongoClient collection retreived');
      collection.insertOne(IoTHubMessage, {w: 1});
      client.close();
      context.log(`Message saved to CosmosDB: ${JSON.stringify(IoTHubMessage)}`);
      context.done();
    });

  } catch (error){
    context.log(`Error ${error}`);
  }

  context.log('Done!');
  context.done();
  
}