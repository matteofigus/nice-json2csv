var http = require('http');
var express = require('express');
var _ = require('underscore');

var res = express.response || http.ServerResponse.prototype;

exports.convert = function(data){

  if(data == null || data.length == 0)
    return "";

  var headerValues = [];
  for(var i = 0; i < data.length; i++){ 
    var rowKeys = _.keys(data[i]);
    headerValues = _.union(rowKeys, headerValues);
  }

  headerValues = _.sortBy(headerValues, function(el){ return el });

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

res.csv = function(data, fileName){

  res.charset = res.charset || 'utf-8';
  res.header('Content-Type', 'text/csv');
  res.header('Content-disposition', 'attachment; filename=' + fileName);

  var body = exports.convert(data);
  
  return res.send(body);
};