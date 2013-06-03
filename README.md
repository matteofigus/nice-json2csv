nice-json2csv
=============

A simple tool for converting json to csv - it doesn't require headers

# Installation

	npm install nice-json2csv

# Usage

	var express = require('express');
	var json2csv = require('nice-json2csv');

	var app = express();

	app.get('/', function(req, res){
		var myData = [{ "first_name": "John", "last_name": "Doe"}, { "first_name": "Jane", "last_name": "Doe"}, { "first_name": "Mick"}];
		
		res.csv(myData, "filename.csv");
	});

	app.listen(3000);
