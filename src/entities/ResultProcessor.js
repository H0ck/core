const utils = require('../../utils');

function ResultProcessor({ name, code, parameters }) {
    this.name = name;
    this.code = code;
    this.parameters = parameters;
};

ResultProcessor.prototype.process = async function (results, params) {
    let responseScript = await utils.runScript(utils.JSONEscape(this.code), { results: results, params: params });
    return responseScript;
}


module.exports = ResultProcessor;