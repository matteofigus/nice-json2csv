nice-json2csv [![Build Status](https://secure.travis-ci.org/matteofigus/nice-json2csv.png?branch=master)](http://travis-ci.org/matteofigus/nice-json2csv)
=============

[![NPM](https://nodei.co/npm/nice-json2csv.png?downloads=true)](https://npmjs.org/package/nice-json2csv)

A simple node.js tool that converts a Json object to a CSV output without requiring headers.
It can extend the Response object on Express.js to easily produce csv files available to be downloaded.

# Installation

```shell
npm install nice-json2csv
```

# Usage

### convert(jsonObject [, columns] [, suppressHeader])

Include the library and use the convert function to get a csv string from your json object.

```js
var json2csv = require('nice-json2csv');
var myData = [{ "first_name": "John", "last_name": "Doe"}, { "first_name": "Jane", "last_name": "Doe"}, { "first_name": "Mick"}];

// all the json object
var csvContent = json2csv.convert(myData);

// just the 'first_name' column
var justFirstNames = json2csv.convert(myData, ["first_name"]);

// without the header row
var noHeader = json2csv.convert(myData, ["first_name"], true);
```

# Usage with Express.js

Include the library and decorate the Express object with app.use() as shown in the example after the express() initialisation. After that, res.csv() will be available.

### res.csv(jsonObject, fileName [, columns] [, suppressHeader])

Somewhere in your app.js, your middleware, or wherever you instantiate express.js

```js
var express = require('express');
var json2csv = require('nice-json2csv');

var app = express();

app.use(json2csv.expressDecorator);  

app.get('/getCsv', function(req, res){
	res.csv([{ "hello": "world" }], "myFile.csv");
});

app.listen(3000);
```

# License

MIT

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/matteofigus/nice-json2csv/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

