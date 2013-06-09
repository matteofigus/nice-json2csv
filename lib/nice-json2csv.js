var http = require('http');
var express = require('express');
var _ = require('underscore');

var converter = {
  fixInput: function(parameter){
    if(parameter && parameter.length == undefined && _.keys(parameter).length > 0) 
      parameter = [parameter]; // data is a json object instead of an array of json objects

    return parameter;
  },
  getColumns: function(data){
    var columns = [];

    for(var i = 0; i < data.length; i++)
      columns = _.union(columns, _.keys(data[i]));

    return columns;
  },
  convertToCsv: function(data){
    return JSON.stringify(data)
               .replace(/],\[/g,'\n')
               .replace(/]]/g,'')
               .replace(/\[\[/g, '');
  }, 
  convert: function(data, headers){
    data = this.fixInput(data);

    if(data == null || data.length == 0)
      return ""

    var columns = headers ? ((typeof headers == 'string') ? [headers] : headers) : this.getColumns(data);

    var rows = [];
    rows.push(columns);

    for(var i = 0; i < data.length; i++){ 
      var row = []; 
      _.forEach(columns, function(column){ 
        var value = typeof data[i][column] == "object" && "[Object]" || data[i][column] || "";
        row.push(value);
      }); 
      rows.push(row); 
    }

    return this.convertToCsv(rows);
  }
};

exports.convert = function(data, headers){
  return converter.convert(data, headers);
};

var res = express.response || http.ServerResponse.prototype;

res.csv = function(data, fileName, headers){

  this.charset = res.charset || 'utf-8';
  this.header('Content-Type', 'text/csv');
  this.header('Content-disposition', 'attachment; filename=' + fileName);

  var body = converter.convert(data, headers);
  
  return this.send(body);
};