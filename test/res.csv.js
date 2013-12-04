var superagent = require('superagent');
var should = require('should');

var json2csv = require('./../index');
var express = require('express');

describe('res.csv()', function(){

  before(function(done){
    var app = express();
    var myData = [{ "a": "b", "c": "d"}, { "a": "e", "c": "f"}];
      
    app.use(json2csv.expressDecorator);   

    app.get('/test', function(req, res){
      res.csv(myData, "filename.csv");
    });

    app.get('/test2', function(req, res){
      res.csv(myData, "filename.csv", null, true);
    });

    app.get('/external-route', require('./fixtures/route').downloadCSV);

    app.listen(3009, done);
  });

  it('should correctly return my csv when invoked through express', function(done) {
    superagent.get("http://127.0.0.1:3009/test").end(function(res){
      res.headers['content-disposition'].should.be.eql('attachment; filename=filename.csv');
      res.text.should.eql("\"a\",\"c\"\n\"b\",\"d\"\n\"e\",\"f\"");
      done();
    });
  });

  it('should correctly return my csv when invoked through express and suppressHeader option', function(done) {
    superagent.get("http://127.0.0.1:3009/test2").end(function(res){
      res.text.should.eql("\"b\",\"d\"\n\"e\",\"f\"");
      done();
    });
  });

  it('should correctly return my csv when invoked through express with a route that is required from a different file', function(done) {

    superagent.get("http://127.0.0.1:3009/external-route").end(function(res){
      res.headers['content-disposition'].should.be.eql('attachment; filename=results.csv');
      res.text.should.eql("\"a\",\"c\"\n\"b\",\"d\"\n\"e\",\"f\"");
      done();
    });

  });

});