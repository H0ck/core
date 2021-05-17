const requireFromString = require('require-from-string');

// Run raw JS file with a specific configuration.
async function runScript(scriptText, config) {
    let scriptResponse;
    try {
        const module = requireFromString(scriptText);
        scriptResponse = await module.main(config.result, config.params);
    } catch (error) {
        scriptResponse = 'Error running code: ' + error;
        throw Error(scriptResponse);
    }
    return scriptResponse;
}

function JSONEscape(string){
    var myEscapedJSONString = string.replace(/\\n/g, "\\n")
    .replace(/\\'/g, "\\'")
    .replace(/\\"/g, '\\"')
    .replace(/\\&/g, "\\&")
    .replace(/\\r/g, "\\r")
    .replace(/\\t/g, "\\t")
    .replace(/\\b/g, "\\b")
    .replace(/\\f/g, "\\f");
    return myEscapedJSONString;
}

module.exports.runScript = runScript;
module.exports.JSONEscape = JSONEscape;
