const {Schema, model} = require('mongoose')
/** 
 * @description Модель коллекции задач tasks 
 */

const Task = new Schema ({
    taskname: {type: String, required: true},
    description: {type: String, required: true},
    filename: {type: String, required: false},
})

module.exports = model('Task', Task)