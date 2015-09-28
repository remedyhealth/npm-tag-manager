var request = require("request");

var base_url = "http://localhost:9091/"

describe("Tag Service", function(){
	describe("HTTP: GET /", function(){
		it("responds with HTTP status 200.", function(done){
			request.get(base_url, function(error, response, body){
				expect(response.statusCode).toBe(200);
				done();
			});
		});
		it("responds with body: 'Tag Service.'", function(done){
			request.get(base_url, function(error, response, body){
				expect(body).toBe("Tag Service");
				done();
			});
		});
	});
});
