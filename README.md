nice-json2csv
=============
[![Build Status](https://secure.travis-ci.org/matteofigus/nice-json2csv.png?branch=master)](http://travis-ci.org/matteofigus/nice-json2csv)

A simple tool for converting a Json object to CSV without requiring headers.
It also extends res on Express.js to easily produce csv files available to be downloaded.

# Installation

	npm install nice-json2csv

# Usage

	var json2csv = require('nice-json2csv');
	var myData = [{ "first_name": "John", "last_name": "Doe"}, { "first_name": "Jane", "last_name": "Doe"}, { "first_name": "Mick"}];

	var csvContent = json2csv.convert(myData);

	var justFirstNames = json2csv.convert(myData, ["first_name"]);

# Usage with Express.js
	
	var express = require('express');
	var json2csv = require('nice-json2csv');

	var app = express();

	var myData = [{ "first_name": "John", "last_name": "Doe"}, { "first_name": "Jane", "last_name": "Doe"}, { "first_name": "Mick"}];

	app.get('/getPeople', function(req, res){
		res.csv(myData, "people.csv");
	});

	app.get('/getNames', function(req, res){
		res.csv(myData, "names.csv", ["first_name"]);
	});

	app.listen(3000);

# License

MIT