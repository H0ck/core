const Redis = require("ioredis");
const redis = new Redis();
const utils = require('../../utils');

function ResultProcessor({ name, code, parameters}) {
    this.name = name;
    this.code = code;
    this.parameters = parameters;
};

ResultProcessor.prototype.process = function(results, params){
    let responseScript = await utils.runScript(utils.JSONEscape(this.code), {results: results, params: params});
    return responseScript;
}

module.exports.getJobResultProcessors = async function getJobResultProcessors(jobId){
        let arrayUnparsed = await redis.lrange("resultProcessors_" + jobId, 0, -1);
        return arrayUnparsed.map(processorString => {
            let parsing = JSON.parse(processorString);
            return new ResultProcessor(parsing.name, parsing.code, parsing.parameters);
        })
}

module.exports.getJobResultProcessorByName = async function getJobResultProcessorsByName(jobId, name){
    return await getJobResultProcessors(jobId).find(processor=> processor.name === name);
}


module.exports.ResultProcessor = ResultProcessor;