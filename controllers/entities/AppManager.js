let Jobs = [];
let JobsResults = {};


function getJobs() {
    return Jobs;
}
function addJob(job) {
    job.getTaskCount();
    Jobs.push(job);
    job.start()
}

function getResultResumed(jobId) {
    let resume = { fields: {} }
    JobsResults[jobId]?.forEach(result => {
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

function getResults(jobId) {
    return JobsResults[jobId];
}

function pushResult(jobId, result) {
    if (!JobsResults[jobId]){
        JobsResults[jobId] = [];
    }
    console.log("PUSHING:", result)
    JobsResults[jobId].push(result);
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