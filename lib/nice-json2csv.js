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
  convert: function(data, headers, suppressHeader){
    if (!_.isBoolean(suppressHeader)) 
      suppressHeader = false;
    
    data = this.fixInput(data);

    if(data == null || data.length == 0)
      return ""

    var columns = headers ? ((typeof headers == 'string') ? [headers] : headers) : this.getColumns(data);
    var rows = [];

    if (!suppressHeader) 
      rows.push(columns);

    for(var i = 0; i < data.length; i++){ 
      var row = []; 
      _.forEach(columns, function(column){ 
        var value = typeof data[i][column] == "object" && data[i][column] && "[Object]" || data[i][column] || "";
        row.push(value);
      }); 
      rows.push(row); 
    }

    return this.convertToCsv(rows);
  },
  decorateExpress: function(data, fileName, headers, suppressHeader){ 

    this.charset = this.charset || 'utf-8';
    this.header('Content-Type', 'text/csv');
    this.header('Content-disposition', 'attachment; filename=' + fileName);

    var body = converter.convert(data, headers, suppressHeader);
    
    return this.send(body);
  }
};

exports.convert = function(data, headers, suppressHeader){
  return converter.convert(data, headers, suppressHeader);
};

exports.expressDecorator = function(req, res, next){
  res.csv = converter.decorateExpress;
  next();
};
