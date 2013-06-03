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

  it('should correctly extend headers', function(done){
    json2csv.convert([{ "a": "b"},{ "a": "b", "c": "d"}]).should.be.eql("\"a\",\"c\"\n\"b\",\"\"\n\"b\",\"d\"");
    done();
  });

  it('should correctly merge headers', function(done){
    json2csv.convert([{ "a": "b"},{ "c": "d"}]).should.be.eql("\"a\",\"c\"\n\"b\",\"\"\n\"\",\"d\"");
    done();
  });

});