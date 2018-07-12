var assert = require('assert');

var messages = require('../message');

function databaseStub() {}

databaseStub.insert = function (hash, message, callback) {
	
	switch (message){
		case 'foo\n':
			callback(null, {});
			break;
		default:
			callback({ 'message': 'database insert error'}, null);	
	}
}
databaseStub.lookupMessage = function (hash, callback) {
	
	switch (hash){
		case 'b5bb9d8014a0f9b1d61e21e796d78dccdf1352f23cd32812f4850b878ae4944c':
			callback(null, { 'Items': [ { 'message': 'foo\n' } ], 'Count': 1});
			break;
		case 'willnotbefound':
			callback(null, { 'Items': [], 'Count': 0});
			break;
		default:
			callback({ 'message': 'database error'}, null);		
	}
	
}


describe('message library', function() {
  describe('post()', function() {
    it('should return 200 status and correct hash if successful', function(done) {
	  messages.post(databaseStub, 'foo\n', function(err, res) {
		  assert.equal(res.statusCode, 200);
		  assert.equal(res.body.digest, 'b5bb9d8014a0f9b1d61e21e796d78dccdf1352f23cd32812f4850b878ae4944c');
	  });
      done();
    });
  });
  describe('post()', function() {
    it('should return 400 status if bar sent in, to simulate db insert failure', function(done) {
      messages.post(databaseStub, 'bar', function(err, res) {
		  assert.equal(res.statusCode, 400);
	  });
      done();
    });
  });
  describe('post()', function() {
    it('should return 400 status if empty string sent in', function(done) {
      messages.post(databaseStub, '', function(err, res) {
		  assert.equal(res.statusCode, 400);
	  });
      done();
    });
  });
  describe('post()', function() {
    it('should return 400 status if null sent in', function(done) {
      messages.post(databaseStub, null, function(err, res) {
		  assert.equal(res.statusCode, 400);
	  });
      done();
    });
  });
});



describe('message library', function() {
  describe('get()', function() {
    it('should return 200 status and correct message if successful', function(done) {
	  messages.get(databaseStub, 'b5bb9d8014a0f9b1d61e21e796d78dccdf1352f23cd32812f4850b878ae4944c', function(err, res) {
		  assert.equal(res.statusCode, 200);
		  assert.equal(res.body.message, 'foo\n');
	  });
      done();
    });
  });
  describe('get()', function() {
    it('should return 404 status and correct message if unknown hash sent in', function(done) {
	  messages.get(databaseStub, 'willnotbefound', function(err, res) {
		  assert.equal(res.statusCode, 404);
		  assert.equal(res.body.err_msg, 'Message not found');
	  });
      done();
    });
  });
  describe('get()', function() {
    it('should return 400 status and correct message if no hash sent in', function(done) {
	  messages.get(databaseStub, '', function(err, res) {
		  assert.equal(res.statusCode, 400);
	  });
      done();
    });
  });
  describe('get()', function() {
    it('should return 400 status and correct message if null sent in for hash', function(done) {
	  messages.get(databaseStub, null, function(err, res) {
		  assert.equal(res.statusCode, 400);
	  });
      done();
    });
  });
  
});
