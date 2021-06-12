
const fs = require('fs');
const path = require('path');
const resultProcessorStorage = require('../db/resultProcessorStorage');

async function storeDefaultResultProcessors() {
    console.log("Creating default ResultProcessors")
    fs.readdirSync(path.join(__dirname, "/defaults")).forEach(async (file) => {
        let processor = require('./defaults/' + file);
        let processorSaved = await resultProcessorStorage.addResultProcessor(processor);
        await resultProcessorStorage.addDefaultResultProcessorId(processorSaved.id);
    });
}

module.exports.storeDefaultResultProcessors = storeDefaultResultProcessors;