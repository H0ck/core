const Redis = require("ioredis");
const redisPort = process.env.REDIS_PORT || 6379;
const redisHost = process.env.REDIS_HOST || "localhost";
const redis = new Redis(redisPort, redisHost);


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