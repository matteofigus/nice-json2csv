var express = require('express');
var http = require('http');
var superagent = require('superagent');
var should = require('should');
var _ = require('underscore');

var json2csv = require('./../index');

describe('res.csv()', function(){

  before(function(done){
    var app = express();
    var myData = [{ "a": "b", "c": "d"}, { "a": "e", "c": "f"}];
      
    app.get('/test', function(req, res){
      res.csv(myData, "filename.csv");
    });

    app.get('/external-route', require('./fixtures/route').downloadCSV);
    app.listen(3009, done);
  });

  it('should correctly extend res', function(done) {
    var resExpressHttp = express.response || http.ServerResponse.prototype;
    resExpressHttp.csv.should.be.a('function');
    done();
  });

  it('should correctly return my csv when invoked through express', function(done) {
    superagent.get("http://127.0.0.1:3009/test").end(function(res){
      res.headers['content-disposition'].should.be.eql('attachment; filename=filename.csv');
      res.text.should.eql("\"a\",\"c\"\n\"b\",\"d\"\n\"e\",\"f\"");
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