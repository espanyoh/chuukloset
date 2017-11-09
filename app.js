// get all required items
var express = require('express');
var engines = require('consolidate');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var assert = require('assert');
var logger = require('morgan');
var path = require('path');
var favicon = require('serve-favicon');
var port = process.env.PORT || 8080;
var mongoUri = process.env.MONGOLAB_URI ||
        process.env.MONGOHQ_URL ||
        //'mongodb://localhost/chuudb';
        'mongodb://chuuadmin:espany9h@ds119768.mlab.com:19768/chuukloset';

var app = express();


// configure our server
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));




// make sure we can connect to database before starting server
MongoClient.connect(mongoUri, function(err, db) {

    assert.equal(null, err);
    console.log('Successfully connected to mondodb');

    app.get('/', function(req, res) {
        db.collection('orders').find({}).toArray(function(err, docs) {
            res.render('index', {'orders': docs} );
        });
    });

    app.post('/', function(req, res) {

        db.collection('orders').insertOne({
                                            channel: req.body.channel || 'line',
                                            hashID: req.body.hashID || 'qawiefw',
                                            password: req.body.password || 'password',
                                            name: req.body.name || 'kano',
                                            details: req.body.details || '',
                                            price: req.body.price || '',
                                            address: req.body.address || '',
                                            shipType: req.body.shipType || '',
                                            status: req.body.status || '',
                                            orderDate: req.body.orderDate || '',
                                            paidDate: req.body.paidDate || '',
                                            deliveryDate: req.body.deliveryDate || '',
                                            trackingNo: req.body.trackingNo || '',
                                            remark: req.body.remark
                                        }, function(err, doc) {
                                            assert.equal(null, err);
                                            res.render('newmovie', {movie: req.body});
                                        }
        );

    });

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
      app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
      });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    });



    app.listen(port, function() {
        console.log('Server listening on port '+ port);
    });

});
