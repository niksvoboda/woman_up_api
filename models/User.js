const {Schema, model} = require('mongoose')
/** 
 * @description Модель коллекции пользователей users
 */

const User = new Schema ({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true}
})

module.exports = model('User', User)