var express = require('express');
var http = require('http');
var should = require('should');
var _ = require('underscore');

var res = express.response || http.ServerResponse.prototype;

var json2csv = require('./../index');

describe('res.csv()', function(){
  it('should correctly extend res', function(done) {
    res.csv.should.be.a('function');
    done();
  });
});