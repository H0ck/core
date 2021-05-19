

module.exports.main = async function(results, params) {
    let index = parseInt(params?.index);
    if (!index){
        return "Please specify a index in the request body"
    }
    return results[parseInt(params?.index) || 0];
}

module.exports = {
    name: "getResultByIndex",
    code: "module.exports.main = " + this.main.toString(),
    parameters: { "index": "0" }
}
