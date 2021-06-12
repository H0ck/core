let Jobs = [];

const resultProcessorStorage = require('../db/resultProcessorStorage');


function getJobs() {
    return Jobs;
}

async function addJob(job) {
    job.getTaskCount();
    Jobs.push(job);
    job.resultProcessors?.forEach(async (processor)=>{
        let added = await resultProcessorStorage.addResultProcessor(processor);
        await resultProcessorStorage.pushResultProcessorIdToJob(job.id, added.id);
    })
    job.start()
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
    setInterval(processJobs, 5000);
};

module.exports.getJobs = getJobs;
module.exports.addJob = addJob;
module.exports.startJobProcessor = startJobProcessor;