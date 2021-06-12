 const AWS = require('aws-sdk');
 AWS.config.region = 'eu-west-3';
 var lambdaExecutor = new AWS.Lambda();

 //TODO: Retrieve availability dinamically
 let lambdaAvailabilityMap = {
     'h0ck-framework-testing': 5,
     'h0ck-framework-scraping': 5
 }

 module.exports.getLambdaAvailability = function getLambdaAvailability(lambdaType){
    return lambdaAvailabilityMap[lambdaType];
 }
