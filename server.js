#!/bin/env node

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , terfight = require('./terfight')

var app = express();

// all environments
app.set('domain', process.env.OPENSHIFT_INTERNAL_IP || '0.0.0.0');
app.set('port', process.env.OPENSHIFT_INTERNAL_PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app);
    io = require('socket.io').listen(server);

server.listen(app.get('port'), app.get('domain'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Websockets
//io.set('transports', ['xhr-polling']);
io.set('log level', 1);
io.sockets.on('connection', terfight.new_connection);

// Terfight specific
setInterval(terfight.send_info, 20, io.sockets);
setInterval(terfight.update_shots, 10);
