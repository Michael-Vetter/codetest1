/*
 * message.js
 * Handles business logic of saving and looking up a message
 * 
 * methods:
 *		post - Receive a message and calculate and return the 256 SHA hash of the message.
 *             The hash is returned via callback function.  The returned object has the format:
 *             {
 *              	statusCode: 200,
 *                  body: {
 *							digest: <256 SHA hash value>
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
 *		get - Return message for a given hash value.
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
 *		dbContext - an object that handles database details. Must implement the methods 'insert' and 'lookupMessage'
 *		message - the text to that will be hashed using the SHA256 algorithm
 *		callback - A function that will be called with the parameters: (error, response).  However, error is not used.  Errors are returned in the response.
 *		hash - The hashed valued of the message.
*/

var shasum = require('shasum')

var exports = module.exports = {};

var hash = ''; 

exports.post = function(dbContext, message, callback) {
	
    hash = shasum(message,'sha256','hex');

    const databaseCallback = (err, res) => {
		var returnData = { statusCode: 200, body: {} };
		
		if (err) {
			returnData.statusCode = 400;
			returnData.body = { 'err_msg': err.message };
		}
		else 
			returnData.body = { 'digest': hash };
		
		callback(null, returnData)
	};
	
	dbContext.insert(hash, message, databaseCallback);
	
};

exports.get = function(dbContext, hash, callback) {
    
    const databaseCallback = (err, res) => {
		console.log('databaseCallback:', err, res);
		var returnData = { statusCode: 200, body: {} };
		
		if (err) {
			returnData.statusCode = 400;
			returnData.body = { 'err_msg': err.message };
		}
		else {
			if (res.Count > 0)
				returnData.body = { 'message': res.Items[0].message };
			else {
				returnData.statusCode = 404;
				returnData.body = { 'err_msg': 'Message not found' };
			}
		}
		
		callback(null, returnData)
	};
	
	dbContext.lookupMessage(hash, databaseCallback);
	
};
