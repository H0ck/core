let Jobs = [];

const Redis = require("ioredis");
const redis = new Redis();

function getJobs() {
    return Jobs;
}

function addJob(job) {
    job.getTaskCount();
    Jobs.push(job);
    job.start()
}

async function getResultResumed(jobId) {
    let resume = { fields: {} }
    let results = await getResults(jobId);
    results?.forEach(result => {
        if(!result) { return;}
        Object.keys(result).forEach(resultKey => {
            let resultValueString = JSON.stringify(result[resultKey]);
            if (!resume.fields[resultKey]) {
                resume.fields[resultKey] = {
                    count: 0,
                    variancesValues: {},
                    variancesCount: 0
                }

            }
            resume.fields[resultKey].count++;
            //Add the result value to the variances aggregation if not present
            let variancesAggregation = resume.fields[resultKey].variancesValues;
            if (!variancesAggregation[resultValueString]) {
                variancesAggregation[resultValueString] = 0;
                resume.fields[resultKey].variancesCount++; //Add one variance count
            }
            variancesAggregation[resultValueString]++;
        })
    })
    //Remove variances values
    Object.keys(resume.fields).forEach(key => {
     //   delete resume.fields[key].variancesValues;
    })
    return resume;
}

async function getResults(jobId) {
   return (await getResultsPlain(jobId)).map(JSON.parse);
}

async function getResultsPlain(jobId) {
   return await redis.lrange("results_" + jobId, 0, -1);

}

function pushResult(jobId, result) {
    console.log(JSON.stringify(result))
    return redis.lpush("results_" + jobId, JSON.stringify(result)).catch(err=>{
    });
}

function processJobs() {
    console.log("Processing jobs");

    Jobs.filter(isRunning).filter(hasMoreTasks).forEach(job => {
        let limits = job.configuration.limits;
        let executionAllowance = limits.parallelExecutions - job.status.currentExecutions;
        let numberOfTaskToProcess = (executionAllowance < limits.requestPerSecond) ? executionAllowance : limits.requestPerSecond;
        processNewTasks(job, numberOfTaskToProcess);
    })
}

function isRunning(job) {
    return job.running;
}

function hasMoreTasks(job){
    return job.hasMoreTasks();
}

function processNewTasks(job, count) {
    for (var i = 0; i < count; i++) {
        if (job.hasMoreTasks()) {
            job.executeNextTask();
        }
    }
}

function startJobProcessor() {
    setInterval(processJobs, 1000);
};

module.exports.getJobs = getJobs;
module.exports.addJob = addJob;
module.exports.getResults = getResults;
module.exports.getResultResumed = getResultResumed;
module.exports.pushResult = pushResult;
module.exports.startJobProcessor = startJobProcessor;