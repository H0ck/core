let yaml = require('js-yaml');
const fs = require('fs');
const axios = require('axios');
const JobManager = require('../controllers/entities/JobManager')
const LambdaManager = require('../controllers/entities/LambdaManager');
const { Lambda } = require('aws-sdk');
async function run() {
    let job1 = yaml.load(fs.readFileSync('./jobExamples/jobList.yaml'));
    let job2 = yaml.load(fs.readFileSync('./jobExamples/jobRange.yaml'));
    let jobUrl = yaml.load(fs.readFileSync('./jobExamples/jobUrl.yaml'));
    let selectedJob = job2;
    // console.log('Param decomposition: ', await getParamDecomposition(selectedJob.parametrization))
    // selectedJob.parametrization.parameters.forEach(async param => {
    //     let paramResult = await getRawParameterList(param);
    //     console.log(paramResult);
    // });

    console.log(await getTaskForJob(selectedJob, 300));
}







async function test(){
    let job = await JobManager.JobFromFile('./jobExamples/jobList.yaml');
   // console.log(await job.parametrization.parameters[0].getRawParameterList())
   await job.validate();
   console.log('CONFIG:' , job.configuration)

   let taskResponse = await job.executeTask(1)
   console.log("FINISHED")
   console.log(taskResponse);
    
}
//let job = Object.create(JobManager.Job, {id:'asd'});


test();

//run();