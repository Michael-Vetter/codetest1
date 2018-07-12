/*
 * messageDatabase.js
 * Inserts and writes to an AWS DynamoDB table (table name defined in the variable messageTable below.
 * 
 * methods:
 *		insert - Store a message in the table using the input hash value as the index value.
 * 			     If the hash value already exists, the existing message will be replaced.
 *
 *		lookupMessage - Return message for a given hash value.
 *            The message is returned via callback function. The returned object has the format:
 *             {
 *              	statusCode: 200,
 *                  body: {
 *							message: <message>
 *                        }
 *             }
 *             or
 *             {
 *              	statusCode: xxx,
 *                  body: {
 *							err_msg: <error message>
 *                        }
 *             }
 *
 * Parameters:
 *		hash - the index value used in the table
 *		message - the message to be stored in the table via the index value of the hash parameter
 *		callback - A function that will be called by AWS with the parameters: (error, response). 
 *		
*/
const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

const messageTable = "codeSample1DB";

var exports = module.exports = {};

exports.insert = function (hash, message, callback) {
	
	//format for inserting into dynamoDB
	var params = {
		Item: {
			"messageHash": hash, 
			"message": message, 
		}, 
		TableName: messageTable
	};
	
	dynamo.putItem(params, callback);
	
}

exports.lookupMessage = function (hash, callback) {
	
	//format for getting dynamoDB record
	var params = {
		TableName: messageTable,
		KeyConditionExpression: 'messageHash = :hkey',
		ExpressionAttributeValues: {
			':hkey': hash  
		}
	};
	
	dynamo.query(params, callback);
	
}