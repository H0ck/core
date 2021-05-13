 const lambdasAvailables = 100;
 const AWS = require('aws-sdk');
 AWS.config.region = 'eu-west-3';
 var lambdaExecutor = new AWS.Lambda();


 function Lambda(id, lastExecution,) {
     this.id = id,
     this.lastExecution = lastExecution;
 }

 Lambda.prototype.execute = async function(code){
    //Implement Lambda code execution

    let payload = {
        httpMethod: 'POST',
        body: {
            script: code,
            config: null,
        }
    }
    let params = {
        FunctionName: 'h0ck-lambda-' + this.id,
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: JSON.stringify(payload),
    }

    console.log("INVOKING", params)
    let x = await lambdaExecutor.invoke(params, function(err, data) {
        if (err) {
         console.error(err);
        } else {
          console.log('Lambda_B said ', data);
        }
      })
    ;
    console.log(x);

 }

 module.exports.Lambda = Lambda;