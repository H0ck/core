'use strict'


const resultProcessorStorage = require('../src/db/resultProcessorStorage');
const resultStorage = require('../src/db/resultStorage');

module.exports.getJobResultProcessors = async function getJobResultProcessors(req, res, next) {
    res.send(await resultProcessorStorage.getResultProcessorsByJobId(req.jobId.value));
};

module.exports.addJobResultProcessor = async function addJobResultProcessor(req, res, next) {
    let resultProcessor = await resultProcessorStorage.addResultProcessor(req.resultProcessor.value);
    if (resultProcessor.id){
        let pushResult = await resultProcessorStorage.pushResultProcessorIdToJob(resultProcessor.id);
        res.send(pushResult);
    }else {
        res.status(400).send("Error creating the result processor");
    }
};


module.exports.findJobResultProcessorByName = async function findJobResultProcessorByName(req, res, next) {
    res.send(await resultProcessorStorage.getResultProcessorByJobIdAndResultProcessorName(req.jobId.value, req.name.value));
};


module.exports.processResultProcessor = async function processResultProcessor(req, res, next) {
    let resultProcessor = await resultProcessorStorage.getResultProcessorByJobIdAndResultProcessorName(req.jobId.value, req.name.value);
    if (!resultProcessor) {
        resultProcessor = await resultProcessorStorage.getDefaultResultProcessorByName(req.name.value);
    }
    if (!resultProcessor){
        res.status(404).send("ResultProcessor not found")
    } else {
        let jobResults = await resultStorage.getResultsByJobId(req.jobId.value);
        res.send(await resultProcessor.process(jobResults, req.params.value));
    }
  
};

module.exports.deleteJobResultProcessor = async function deleteJobResultProcessor(req, res, next) {
    res.send(await resultProcessorStorage.removeResultProcessorByJobIdAndResultProcessorName(req.jobId.value, req.name.value));
};

module.exports.updateResultProcessor = async function updateResultProcessor(req, res, next) {
};