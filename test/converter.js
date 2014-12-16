var should = require('should');

var json2csv = require('./../index');

describe('The converter', function(){
  it('should return an empty csv if the data is null', function(done){
    json2csv.convert(null).should.be.eql("");
    done();
  });

  it('should return a valid csv if the data is valid', function(done){
    json2csv.convert([{ "a": "b", "c": "d"}]).should.be.eql("\"a\",\"c\"\n\"b\",\"d\"");
    done();
  });

  it('should return a blank value for null values', function(done){
    json2csv.convert([{ "a": "b", "c": "d"},{ "a": "b"}]).should.be.eql("\"a\",\"c\"\n\"b\",\"d\"\n\"b\",\"\"");
    done();
  });

  it('should return a blank value for explicit "null" value', function(done){
    json2csv.convert([{ "a": "b", "c": "d"},{ "a": "b", "c": null}]).should.be.eql("\"a\",\"c\"\n\"b\",\"d\"\n\"b\",\"\"");
    done();
  });

  it('should return a correct value for numeric 0 values', function(done){
    json2csv.convert([{ "a": 1, "c": 0},{ "a": "b", "c": 23}]).should.be.eql("\"a\",\"c\"\n\"1\",\"0\"\n\"b\",\"23\"");
    done();
  });

  it('should correctly extend headers', function(done){
    json2csv.convert([{ "a": "b"},{ "a": "b", "c": "d"}]).should.be.eql("\"a\",\"c\"\n\"b\",\"\"\n\"b\",\"d\"");
    done();
  });

  it('should correctly merge headers', function(done){
    json2csv.convert([{ "a": "b"},{ "c": "d"}]).should.be.eql("\"a\",\"c\"\n\"b\",\"\"\n\"\",\"d\"");
    done();
  });

  it('should return two rows if the parameter is not an array', function(done){
    json2csv.convert({ "a": "b", "c": "d"}).should.be.eql("\"a\",\"c\"\n\"b\",\"d\"");
    done();
  });

  it('should return one row if suppressHeaders is true', function(done){
    json2csv.convert({ "a": "b", "c": "d"}, null, true).should.be.eql("\"b\",\"d\"");
    done();
  });

  it('should return two rows if suppressHeaders is false', function(done){
    json2csv.convert({ "a": "b", "c": "d"}, null, false).should.be.eql("\"a\",\"c\"\n\"b\",\"d\"");
    done();
  });

  it('should return the selected columns if the headers parameter is specified', function(done){
    json2csv.convert([{ "a": "b", "c": "d"},{ "a": "b"}], ["a"]).should.be.eql("\"a\"\n\"b\"\n\"b\"");
    done();
  });

  it('should return the selected columns if the headers parameter is specified with the suppressHeader option', function(done){
    json2csv.convert([{ "a": "b", "c": "d"},{ "a": "b"}], ["a"], true).should.be.eql("\"b\"\n\"b\"");
    done();
  });

  it('should return the selected column if the headers parameter is a string', function(done){
    json2csv.convert([{ "a": "b", "c": "d"},{ "a": "b"}], "a").should.be.eql("\"a\"\n\"b\"\n\"b\"");
    done();
  });

  it('should work if the headers parameter includes not valid columns', function(done){
    json2csv.convert([{ "a": "b", "c": "d"},{ "a": "b"}], ["a", "y"]).should.be.eql("\"a\",\"y\"\n\"b\",\"\"\n\"b\",\"\"");
    done();
  });

  it('should correctly work with hierarchy > 1', function(done){
    json2csv.convert([{ "a": "b", "c": "d"},{ "a": { "e": "f", "g": "h"}}]).should.be.eql("\"a\",\"c\"\n\"b\",\"d\"\n\"[Object]\",\"\"");
    done();
  });

  it('should correctly handle circular references', function(done){
    var obj = [{ "a": "b", "c": "d"},{ "a": null}];
    obj[1].a = obj[1];
    json2csv.convert(obj).should.be.eql("\"a\",\"c\"\n\"b\",\"d\"\n\"[Object]\",\"\"");
    done();
  });

});
