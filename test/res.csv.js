var express = require('express');
var http = require('http');
var superagent = require('superagent');
var should = require('should');
var _ = require('underscore');

var res = express.response || http.ServerResponse.prototype;

var json2csv = require('./../index');

describe('res.csv()', function(){
  it('should correctly extend res', function(done) {
    res.csv.should.be.a('function');
    done();
  });

  it('should correctly return my csv when invoked through express', function(done) {

    var app = express();
    var myData = [{ "a": "b", "c": "d"}, { "a": "e", "c": "f"}];
      
    app.get('/test', function(req, res){
      res.csv(myData, "filename.csv");
    });

    app.listen(3009, function(){
      superagent.get("http://127.0.0.1:3009/test").end(function(res){
        res.headers['content-disposition'].should.be.eql('attachment; filename=filename.csv');
        res.text.should.eql("\"a\",\"c\"\n\"b\",\"d\"\n\"e\",\"f\"");
        done();
      });
    });
  });
});