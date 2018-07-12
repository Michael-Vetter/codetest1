Code Test 1

a small service that has two endpoints:

/messages takes a message (a string) as a POST and returns the
	SHA256 hash digest of that message (in hexadecimal format)

/messages/<hash> is a GET request that returns the original
	message. A request to a non-existent <hash> should return a 404
	error.

message.js contains the main logic for processing the messages

messageDatabase.js contains the logic for reading/writing to database. Required to be run on AWS to access a DynamoDB table.

index.js is the entry point for being called by AWS Lambda.

------------------------------------------

test/test.js uses mocha to test message.js
