
module.exports.main = async function(results, params) {
    let resume = { fields: {} }
    results?.forEach(result => {
        if(!result) { return;}
        Object.keys(result).forEach(resultKey => {
            let resultValueString = JSON.stringify(result[resultKey]);
            if (!resume.fields[resultKey]) {
                resume.fields[resultKey] = {
                    count: 0,
                    variancesValues: {},
                    variancesCount: 0
                }
                
            }
            resume.fields[resultKey].count++;
            //Add the result value to the variances aggregation if not present
            let variancesAggregation = resume.fields[resultKey].variancesValues;
            if (!variancesAggregation[resultValueString]) {
                variancesAggregation[resultValueString] = 0;
                resume.fields[resultKey].variancesCount++; //Add one variance count
            }
            variancesAggregation[resultValueString]++;
        })
    })
    //Remove variances values
    Object.keys(resume.fields).forEach(key => {
        //   delete resume.fields[key].variancesValues;
    })
    return resume;
}

module.exports = {
    name: "resumeVariances",
    code: "module.exports.main = " + this.main.toString(),
    parameters: {}
}