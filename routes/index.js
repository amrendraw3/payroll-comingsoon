var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/subscribers';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { message: '', type: '' });
});

router.post('/subscribe', function(req, res, next) {
	console.log('Requested: ', req.body)
	console.log('Subscribing!');
	if(!req.body || !req.body.email) {
		console.log('Email not provided!')
		res.render('index', { message: '', type: 'error'});
		return;
	}

	// Connection URL 
	// Use connect method to connect to the Server 
	MongoClient.connect(url, function(err, db) {
		console.log(err);
	  console.log("Connected correctly to server");
	  if(err) {
	  	console.log('Error in database connection!');
	  	res.render('index', { message: '', type: 'error'});
	  	return;
	  }

	  db.collection('documents').update(req.body, {$set: req.body}, {upsert: true}, function(err, data){
	  	if(!err && data) {
	  		console.log('Visitor subscribed!')
				db.close();
				// res.json (req.body);
				res.render('index', { message: 'You have been subscribed successfully!', type: 'success'});
	  	} else {
	  		console.log('Visitor not subscribed!')
				// res.json (req.body);
				res.render('index', { message: '', type: 'error'});
				db.close();
	  	}
	  });
	});
});

router.get('/get-all-subscribers', function(req, res, next) {
	MongoClient.connect(url, function(err, db) {
		console.log(err);
	  console.log("Connected correctly to server");
	  if(err) {
	  	console.log('Error in database connection!');
	  	return;
	  }

	  db.collection('documents').find({}, {_id: 0}).toArray(function(err, data){
	  	if(!err && data) {
	  		console.log('Subscriber list found!')
				db.close();
				console.log(data);
				res.json (data);
	  	} else {
	  		console.log('Visitor not subscribed!')
				res.json ({data: 'No records found!'});
				db.close();
	  	}
	  });
	});
})

module.exports = router;
