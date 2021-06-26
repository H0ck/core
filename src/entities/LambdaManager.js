
 //TODO: Retrieve availability dinamically
 let lambdaAvailabilityMap = {
     'h0ck-framework-testing': 5,
     'h0ck-framework-scraping': 5
 }

 module.exports.getLambdaAvailability = function getLambdaAvailability(lambdaType){
    return lambdaAvailabilityMap[lambdaType];
 }
