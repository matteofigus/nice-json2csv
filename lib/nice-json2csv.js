var _ = require('underscore');

var converter = {

  convertToCsv: function(data){
    return JSON.stringify(data)
               .replace(/],\[/g,'\n')
               .replace(/]]/g,'')
               .replace(/\[\[/g, '');
  }, 

  convert: function(data, headers, suppressHeader){

    suppressHeader = !_.isBoolean(suppressHeader) ? false : suppressHeader;   
    data = this.sanitiseInput(data);

    if(!data || data.length === 0)
      return '';

    if(!!headers && _.isString(headers))
      headers = [headers];

    var columns = headers || this.getColumns(data),
        rows = [];

    if(!suppressHeader) 
      rows.push(columns);

    _.forEach(data, function(item){
      rows.push(_.map(columns, function(column){
        return converter.getValue(item[column]);
      }));
    });

    return this.convertToCsv(rows);
  },

  decorateExpress: function(data, fileName, headers, suppressHeader){ 

    this.charset = this.charset || 'utf-8';
    this.header('Content-Type', 'text/csv');
    this.header('Content-disposition', 'attachment; filename=' + fileName);

    var body = converter.convert(data, headers, suppressHeader);
    
    return this.send(body);
  },

  getColumns: function(data){
    var columns = [];

    _.forEach(data, function(item){ 
      columns = _.union(columns, _.keys(item)); 
    });

    return columns;
  },

  getValue: function(item){

    if(_.isUndefined(item) || _.isNull(item))
      return '';

    if(_.isObject(item))
      return '[Object]';

    return item.toString();
  },

  sanitiseInput: function(parameter){
    return (!!parameter && !_.isArray(parameter)) ? [parameter] : parameter;
  }
};

module.exports = {
  convert: function(data, headers, suppressHeader){
    return converter.convert(data, headers, suppressHeader);
  },
  expressDecorator: function(req, res, next){
    res.csv = converter.decorateExpress;
    next();
  }
};