const Redis = require("ioredis");
const redis = new Redis();
const { v4: uuidv4 } = require('uuid');
const ResultProcessor = require("../entities/ResultProcessor");


// ================= Result Processors - Job Relationship ====================== //

async function removeResultProcessorByJobIdAndResultProcessorName(jobId, name) {
    let resultProcessor = (await getResultProcessorsByIdList(await getResultProcessorsIdListByJobId(jobId))).find(processor=>processor.name === name)
    return removeResultProcessorById(resultProcessor.id);
}

async function getResultProcessorByJobIdAndResultProcessorName(jobId, name) {
    return (await getResultProcessorsByIdList(await getResultProcessorsIdListByJobId(jobId))).find(processor=>processor.name === name);
}

async function getResultProcessorsByJobId(jobId) {
    return await getResultProcessorsByIdList(await getResultProcessorsIdListByJobId(jobId));
}

function getResultProcessorsIdListByJobId(jobId){
    return redis.lrange("job_" + jobId + "_resultProcessors", 0, -1);
}


async function pushResultProcessorIdToJob(jobId, resultProcessorId) {
    if ((await getResultProcessorsIdListByJobId(jobId)).includes(id)) {
        return "Already exists"
    } else {
        return redis.lpush("job_" + jobId + "_resultProcessors", resultProcessorId);
    }
}

async function removeResultProcessorIdFromJob(jobId, resultProcessorId) {
    if ((await getResultProcessorsIdListByJobId(jobId)).includes(id)) {
        return redis.lrem("job_" + jobId + "_resultProcessors", 0, resultProcessorId)
    } else {
       return "404 Not found"
    }
}

module.exports.removeResultProcessorByJobIdAndResultProcessorName = removeResultProcessorByJobIdAndResultProcessorName;
module.exports.getResultProcessorByJobIdAndResultProcessorName = getResultProcessorByJobIdAndResultProcessorName;
module.exports.getResultProcessorsByJobId = getResultProcessorsByJobId;
module.exports.getResultProcessorsIdListByJobId = getResultProcessorsIdListByJobId;
module.exports.pushResultProcessorIdToJob = pushResultProcessorIdToJob;
module.exports.removeResultProcessorIdFromJob = removeResultProcessorIdFromJob;


// ================= Result Processors Operations ====================== //

//Add a result processor
async function addResultProcessor(resultProcessor){
    if (!resultProcessor.id){
        resultProcessor.id = uuidv4();
    }
    if (await redis.exists("resultProcessor_" + resultProcessor.id)){
        return "Already exists"
    }
    let redisOp = redis.set("resultProcessor_" + resultProcessor.id, JSON.stringify(resultProcessor));
    return  redisOp ? resultProcessor : null;
}

//Remove a result processor finding by id
async function removeResultProcessorById(id){
    if (await redis.exists("resultProcessor_" + id)){
        redis.del(id)
    } else {
       return "404 Not found"
    }
}

//Get Result Processor Object by ID
async function getResultProcessorById(idList){
    return (await getResultProcessorsByIdList([idList]))[0];
}

//Get Result Processor Object by Array of ids
async function getResultProcessorsByIdList(idList){
    let arrayKeys = idList.map(id => "resultProcessor_".concat(id));
    if (arrayKeys.length < 1){
        return [];
    }
    let stringProcessorList = await redis.mget(arrayKeys);
    return stringProcessorList.map(JSON.parse).map(parsed => new ResultProcessor(parsed));
}

//Get all default result processors
async function getDefaultResultProcessors(){
    return await getResultProcessorsByIdList(await getDefaultResultProcessorsIdList());
}

//Get all default result processors
async function getDefaultResultProcessorByName(name){
    let defaultResultProcessors = await getResultProcessorsByIdList(await getDefaultResultProcessorsIdList());
    return defaultResultProcessors.find(processor => processor.name === name);
}

function getDefaultResultProcessorsIdList(){
    return redis.lrange("resultProcessors_defaultList", 0, -1)
}

async function addDefaultResultProcessorId(id){
    if ((await getDefaultResultProcessorsIdList()).includes(id)) {
        return "Already exists"
    } else {
        return redis.lpush("resultProcessors_defaultList", id);
    }
}

module.exports.getDefaultResultProcessors = getDefaultResultProcessors;
module.exports.getResultProcessorById = getResultProcessorById;
module.exports.getResultProcessorsByIdList = getResultProcessorsByIdList;
module.exports.removeResultProcessorById = removeResultProcessorById;
module.exports.addResultProcessor = addResultProcessor;
module.exports.addDefaultResultProcessorId = addDefaultResultProcessorId;
module.exports.getDefaultResultProcessorByName = getDefaultResultProcessorByName;
module.exports.getDefaultResultProcessorsIdList = getDefaultResultProcessorsIdList;

