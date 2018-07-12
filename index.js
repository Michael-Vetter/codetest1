/*
 * index.js
 * Entry point for the AWS Lambda function
 * 
 * Called when the service URL is called (via AWS API Gateway)
 *		
 * The event parameter will contain all the request data.	
 *		
 * The callback function will be called to create a response to the caller (handled by AWS).
 *
*/
const message = require('message');
const messageDatabase = require('messageDatabase');


exports.handler = (event, context, callback) => {
	
    console.log('Received event:', JSON.stringify(event, null, 2));

    const messageCallback = (err, res) => 
	{ 		
		callback(null, {
			statusCode: res.statusCode,
			body: JSON.stringify(res.body),
			headers: {
            'Content-Type': 'application/json',
			},
		})
	};
	
	var hash = '';
	var msg = '';
	
    switch (event.httpMethod) {
        case 'GET':
			if(event.pathParameters && event.pathParameters.hash) 
				hash = event.pathParameters.hash;
            message.get(messageDatabase, hash, messageCallback);
            break;
        case 'POST':
			if(event.body && JSON.parse(event.body) && JSON.parse(event.body).message)
				msg = JSON.parse(event.body).message;
			message.post(messageDatabase, msg, messageCallback);
            break;
        default:
            console.log('Unsupported method: ',event.httpMethod);
			callback(null, { statusCode: 400, headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ 'err_msg': 'Bad Request' })});
    }
};
