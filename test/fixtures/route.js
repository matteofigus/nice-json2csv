var Model = {
	loadAll: function(callback){
		callback(null, [{ "a": "b", "c": "d"}, { "a": "e", "c": "f"}]);
	}
}

module.exports.downloadCSV = function(req, res) {

  Model.loadAll(function(err, results) {
    if(err){
    	console.log("ERROR!");
    	return res.send(500);
    }

    res.csv(results, "results.csv");
  });
};