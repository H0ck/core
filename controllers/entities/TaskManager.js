const AWS = require('aws-sdk');
AWS.config.region = 'eu-west-3';
var lambdaExecutor = new AWS.Lambda();


function Task({ index, code, params, lambdaId, framework }) {
    this.index = index,
    this.code = code,
    this.params = params,
    this.framework = framework
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
      FunctionName: this.framework + '-lambda-' + this.lambdaId,
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
      Payload: JSON.stringify(payload),
    }

      invokes++;
      console.log("INVOKING WITH ID:" , this.lambdaId)
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