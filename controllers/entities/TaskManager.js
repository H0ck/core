const lambdasAvailables = 100;
const AWS = require('aws-sdk');
AWS.config.region = 'eu-west-3';
var lambdaExecutor = new AWS.Lambda();


function Task({ index, code, params, lambdaId }) {
  this.index = index,
    this.code = code,
    this.params = params,
    this.lambdaId = lambdaId
}

let invokes = 0;

Task.prototype.execute = function () {
  return new Promise((resolve, reject) => {
    let payload = {
      code: this.code,
      config: { params: this.params },
    }
    let params = {
      FunctionName: 'h0ck-lambda-' + this.lambdaId,
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
      Payload: JSON.stringify(payload),
    }

      invokes++;
    lambdaExecutor.invoke(params, function (err, data) {
      if (err) {
        console.error(err);
      } else {
       // console.log('Lambda_B said ', data);
       try{
         console.log("LAMBDA:", params.FunctionName)
        let dataParsed = JSON.parse(data?.Payload).result;
        console.log("DATAPARSED" , dataParsed)
        resolve(dataParsed);
       } catch (err){
        reject(err)
       } 
       
      }
    });
  })

}
exports.Task = Task;