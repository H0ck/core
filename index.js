'use strict';

var fs = require('fs'),
    http = require('http'),
    path = require('path');

var express = require("express");
require('dotenv').config()
var app = express();
const cors = require('cors');
var bodyParser = require('body-parser');
const AppManager = require('./src/entities/AppManager')
const resultProcessorsUtils = require('./src/resultProcessorUtils');

app.use(bodyParser.json({
  strict: false
}));
app.use(cors());
var oasTools = require('oas-tools');
var jsyaml = require('js-yaml');
var serverPort = process.env.PORT || 7001;

var spec = fs.readFileSync(path.join(__dirname, '/api/oas-doc.yaml'), 'utf8');
var oasDoc = jsyaml.safeLoad(spec);


const Redis = require("ioredis");
const redisPort = process.env.REDIS_PORT || 6379;
const redisHost = process.env.REDIS_HOST || "localhost";
const redis = new Redis(redisPort, redisHost);
redis.flushdb();

var options_object = {
  controllers: path.join(__dirname, './controllers'),
  loglevel: 'info',
  strict: false,
  router: true,
  validator: true
};


resultProcessorsUtils.storeDefaultResultProcessors();
oasTools.configure(options_object);

oasTools.initialize(oasDoc, app, function() {
  http.createServer(app).listen(serverPort, function() {
    console.log("App running at http://localhost:" + serverPort);
    console.log("________________________________________________________________");
    if (options_object.docs !== false) {
      console.log('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
      console.log("________________________________________________________________");
    }
    AppManager.startJobProcessor();
  });
});

app.get('/info', function(req, res) {
  res.send({
    info: "This API was generated using oas-generator!",
    name: oasDoc.info.title
  });
});
