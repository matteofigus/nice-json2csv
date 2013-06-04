var http = require('http');
var express = require('express');
var _ = require('underscore');

var getHeaders = function(data){
  var headerValues = [];

  for(var i = 0; i < data.length; i++){ 
    var rowKeys = _.keys(data[i]);
    headerValues = _.union(rowKeys, headerValues);
  }

  return _.sortBy(headerValues, function(el){ return el });
};

exports.convert = function(data){

  if(data && data.length == undefined && _.keys(data).length > 0)
    data = [data];
  else if(data == null || data.length == 0)
    return ""

  var headerValues = getHeaders(data);

  var rows = [];
  rows.push(headerValues);

  for(var i = 0; i < data.length; i++){ 
    var row = []; 
    _.forEach(headerValues, function(cellIndex){ 
      var value = data[i][cellIndex] ? data[i][cellIndex] : "";
      row.push(value);
    }); 
    rows.push(row); 
  }

  var stringRows = JSON.stringify(rows);
  return stringRows.replace(/],\[/g,'\n').replace(/]]/g,'').replace(/\[\[/g, '');
};

var res = express.response || http.ServerResponse.prototype;

res.csv = function(data, fileName){

  this.charset = res.charset || 'utf-8';
  this.header('Content-Type', 'text/csv');
  this.header('Content-disposition', 'attachment; filename=' + fileName);

  var body = exports.convert(data);
  
  return this.send(body);
};