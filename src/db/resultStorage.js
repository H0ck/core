const Redis = require("ioredis");
const redis = new Redis();


function pushResultToJob(jobId, result) {
    return redis.lpush("results_" + jobId, JSON.stringify(result));
}

async function getResultsByJobId(jobId) {
    return (await getResultsPlainByJobId(jobId)).map(JSON.parse);
}

function getResultsPlainByJobId(jobId) {
    return redis.lrange("results_" + jobId, 0, -1);
}

module.exports.pushResultToJob = pushResultToJob;
module.exports.getResultsByJobId = getResultsByJobId;
module.exports.getResultsPlainByJobId = getResultsPlainByJobId;