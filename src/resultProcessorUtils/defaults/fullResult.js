
module.exports.main = async function(results, params){
    return results;
}

module.exports = {
    name: "fullResult",
    code: "module.exports.main = " + this.main.toString(),
    parameters: {}
}