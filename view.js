   
var express = require('express');

var MongoClient = require('mongodb').MongoClient;

var ObjectId = require('mongodb').ObjectID;

var bodyParser = require('body-parser');

var searchresult, result, xyz;

var app = express();

var database = "mongodb://localhost:27017/first/data";

app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



app.get('/display', function(req, res){

MongoClient.connect(database, function(err, db) {
  if(err) { return console.dir(err); }

  var collection = db.collection('restaurant');
  
  collection.find().sort({average:-1}).toArray(function(err, items) {
    	data = items;

  	 
	    res.set('Content-Type', 'application/json');
      res.send(new Buffer(JSON.stringify(data)));
    }); //callback	
  }); //conect
}); //GET


app.post('/search',function(req,res){  ///////////////////////////////////////RETRIEVE//////////////////////

var name = req.body.name;

//console.log(x);

  MongoClient.connect(database, function(err, db) {
    if(err) { return console.dir(err); }

    var collection = db.collection('restaurant');
  
    collection.find({ name: new RegExp(name,'i')},function(err, cursor) {
      //console.log(JSON.stringify(items));
	   
        cursor.toArray(function(err,data){
          //console.log(data[0]);
        var x = data[0];
        if(x==null)
        {
          res.set('Content-Type', 'text/plain');
          res.send(new Buffer("-1"));
        }
        else
        {
          res.set('Content-Type', 'text/plain');
          res.send(new Buffer(JSON.stringify(data[0])));
        }

        });//callback
    }); //find
  }); //connect
});  //post

app.post('/rate',function(req,res){ ///////////////////////////////////UPDATE//////////////////////////

var name = req.body.name;

var average = req.body.average;

var ratings = parseInt(req.body.ratings,10);

//console.log(name + String(average) + String(ratings));

  MongoClient.connect(database, function(err, db) {
    if(err) { return console.dir(err); }

    var collection = db.collection('restaurant');
  
    collection.findAndModify(
      {name:name},
        [],
       {$inc:{count:1},$set:{ratings:ratings,average:average}},
        {new: true},
        function(err, data) {
        console.log(JSON.stringify(data.value));
          res.set('Content-Type', 'text/html');
        res.send(new Buffer(JSON.stringify(data.value)));
        //callback
    }); //findAndModify
  }); //connect
});  //post

/*app.post('/delete',function(req,res){ //////////////////////DELETE/////////////////////////////////////////

var x = req.body.name;

MongoClient.connect(database, function(err, db) {
  if(err) { return console.dir(err); }

var collection = db.collection('restaurant');
  
collection.remove({ name: x} )});
res.set('Content-Type', 'text/html');
res.send(new Buffer("deleted"));

});
*/

/*app.post('/insert', function(req, res) {  //////////////////////////////CREATE//////////////////////
	var name = req.body.name;
	
  console.log("From Client pOST request: restaurant = "+name);
  res.send(name);
    // Connect to the db
MongoClient.connect(database, function(err, db) {
  if(err) { return console.dir(err); }



var collection = db.collection('restaurant');
  var doc1 = {'name':name,'count':0,'ratings':0,'average':0 };


  collection.insert(doc1,function(err, result) {
  	console.log("Record added");});
collection.find().toArray(function(err, items) {
  	xyz = items;

  	for(var i=0; i<items.length; i++)
  console.log(items[i]);})  
});
});

*/
app.listen(3000);