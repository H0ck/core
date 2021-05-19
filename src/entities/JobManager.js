const yaml = require('js-yaml');
const fs = require('fs');
const axios = require('axios');
const TaskManager = require('./TaskManager');
const h0ckApp = require('./AppManager');
const { exception } = require('console');
const { v4: uuidv4 } = require('uuid');
const AppManager = require('./AppManager');
const resultStorage = require('../db/resultStorage');
const LambdaManager = require('./LambdaManager');


function Job({ id, title, framework, code, parametrizationGroups, configuration, running, status }) {
    this.id = id || uuidv4(),
        this.title = title,
        this.framework = framework,
    this.code = code,
        this.parametrizationGroups = parametrizationGroups.map(group => new Parametrization({ parameters: group.parameters })),
        this.configuration = new JobConfiguration(configuration),
        this.running = running || false,
        this.status = new JobStatus(status || { currentIndex: 0, currentExecutions: 0 });
    this.taskCount = 0;
    this.lastLambda = 0;

};


JobFromFile = async function (file) {
    let jobParams = yaml.load(fs.readFileSync(file));
    jobParams.status = {};
    let job = new Job(jobParams);
    h0ckApp.addJob(job);
    return new Job(jobParams);
}

Job.prototype.getTaskCount = async function () {
    if (this.taskCount == 0) {
        let totalCount = 0;
        for (let group of this.parametrizationGroups) {
            totalCount += await group.getTaskCount();
        }
        this.taskCount = totalCount;
    }
    return this.taskCount;
}

Job.prototype.getNextLambda = function () {
    if (this.lastLambda == 0 || this.lastLambda >= LambdaManager.getLambdaAvailability(this.framework)) {
        this.lastLambda = 1;
    } else {
        this.lastLambda++;
    }
    console.log("Returningn lambda", this.lastLambda)
    return this.lastLambda;
}

Job.prototype.executeTask = async function (index) {
    this.status.currentExecutions++;
    let task = await this.getTask(index);
    let executionResult = await task.execute();
    this.status.currentExecutions--;
    return executionResult;
}

Job.prototype.hasMoreTasks = function () {
    return this.status.currentIndex < this.taskCount;
}

Job.prototype.executeNextTask = async function () {
    if (this.status.currentIndex >= this.taskCount) {
        return null; // No more tasks to execute
    }
    let taskIndex = this.status.currentIndex;
    this.status.currentIndex++;
    let result = { "result": "No response from task" }
    try {
        result = await this.executeTask(taskIndex).catch(err => {
            console.error("Error when executing task (", taskIndex, ") :", err)
        });
        resultStorage.pushResultToJob(this.id, result);
    } catch (err) {
        result.error = err;
        console.error(err)
    }

    return result;
}

Job.prototype.getTask = async function (index) {
    //console.log("GETTING TASK", index)
    let currentGroupMax = 0;
    for (let group of this.parametrizationGroups) {
        let indexInGroup = index - currentGroupMax;
        currentGroupMax += await group.getTaskCount();
        if (index < currentGroupMax) {
            let decomposition = await group.getParamDecomposition();
            let decompositionValues = Object.values(decomposition); //Get only the values
            decompositionValues.pop(); //Remove last element of the list
            let remainder = indexInGroup;
            let paramMap = decompositionValues.reverse().map((val) => { // Reverse to apply the % starting with the higher value
                paramIndex = Math.floor(remainder / val);
                remainder = (remainder % val)
                return paramIndex;
            });
            paramMap.push(remainder); // Push the remainder of the final division to the list (This is the index for the first parameter)
            paramMap.reverse(); //Reverse to original position

            let task = new TaskManager.Task({ index: index, code: this.code, params: {}, framework: this.framework,lambdaId: this.getNextLambda() }); //FIXME: If this method is accesed from outside the
            // executeTask, lambda id will be increased without executing task
            await Promise.all(group.parameters.map(async (param, index) => {
                let rawParamList = await param.getRawParameterList();
                //  console.log("RAW PARAMS", rawParamList)
                //   console.log("GETTING PARAM", param.name, "index", index, "paramMap", paramMap);
                task.params[param.name] = rawParamList[paramMap[index]];
            }))
            //  console.log("FOUND ", index, task.params)
            return task;
        }
    }

}

Job.prototype.start = function () {
    if (!this.running) {
        this.running = true;
    }
}

Job.prototype.stop = function () {
    this.running = false;
}

Job.prototype.validate = async function () {
    let jobTaskCount = await this.getTaskCount();
    this.configuration.taskGroupSize = Math.floor((jobTaskCount / LambdaManager.getLambdaAvailability(this.framework)) / this.configuration.limits.virtualUserExecutions) + 1;
    if (this.configuration.taskGroupSize > this.configuration.limits.parallelExecutions) {
        throw Error('This job is not currently supported. Too much functions to execute.');
    }
    return true;
}




function JobConfiguration({ limits, job }) {
    this.limits = limits;

}

function JobStatus({ currentIndex, currentExecutions }) {
    this.currentIndex = currentIndex;
    this.currentExecutions = currentExecutions;
}

function Parameter({ name, type, definition }) {
    this.name = name,
        this.type = type,
        this.definition = definition
}

Parameter.prototype.getRawParameterList = async function () {
    if (this.type === 'list') {
        return this.definition.split(',').map(i => i.trim());
    }
    if (this.type === 'urlList') {
        let reqList = await axios.get(this.definition);
        return reqList.data.split('\n');
    }
    if (this.type === 'fileList') {
        return fs.readFileSync(this.definition).toString().split("\n");
    }
    if (this.type === 'ranges') {
        let finalParamList = [];
        this.definition.split(',').forEach(range => {
            let rangeParams = range.split('-');
            let diff = parseInt(rangeParams[1]) - parseInt(rangeParams[0]);
            finalParamList = finalParamList.concat(Array.from(Array(diff + 1), (value, index) => index + parseInt(rangeParams[0])));
        })
        return finalParamList;
    }
}

function Parametrization({ parameters }) {
    this.parameters = parameters.map(param => new Parameter(param));
}

Parametrization.prototype.getParamDecomposition = async function () {
    let decomposition = {};
    let lastKey = null;
    await Promise.all(this.parameters.map(async param => {
        let paramList = await param.getRawParameterList();
        if (decomposition[param.name] != null) {
            throw "Param " + param.name + " is duplicated."
        }
        decomposition[param.name] = lastKey ? paramList.length * decomposition[lastKey] : paramList.length;
        lastKey = param.name;
    }))
    return decomposition;
}

Parametrization.prototype.getTaskCount = async function () {
    if (!this.taskCount || this.taskCount === 0) {
        let totalCount = 0;
        await Promise.all(this.parameters.map(async param => {
            let paramList = await param.getRawParameterList();
            totalCount = totalCount === 0 ? paramList.length : totalCount * paramList.length;
        }))
        this.taskCount = totalCount;
    }
    return this.taskCount;
}



module.exports.Job = Job;
module.exports.JobFromFile = JobFromFile;
module.exports.Parameter = Parameter;
module.exports.Parametrization = Parametrization;
module.exports.JobConfiguration = JobConfiguration;