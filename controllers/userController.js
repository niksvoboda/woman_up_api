const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
/**
 * @description Функция генерации jwt-токена
 * @param {*} - передаем в функцию генерации токена ID пользователя из базы (для использования его на фронтенде при необходимости)
 * @returns - возвращаем из функции сгенерированный jwt-токен с временем жизни 72 часа
 * 
 */
const generateToken = id =>{
    const payload = {
        id
    }
    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: "72h"})
}

class userController{
    /**  
     * @description Регистрация нового пользователя
     */
    async registration (req, res) {
        try {
            /**Получаем имя и пароль методом POST и проверяем есть ли пользователь с таким именем в базе */
            const {username, password} = req.body
            const candidate = await User.findOne({username})
            if(candidate) {
                return res.status(400).json({message:'Пользователь уже существует'+candidate})
            }
            /** Если пользователя нет, то создаем его в базе, пароль шифруем через bcrypt и в таком виде сохраняем в базу  */
            const hashPass =  bcrypt.hashSync(password, 5);
            const newUser = new User({username: username, password: hashPass})
            await newUser.save()
            res.status(200).json({message: 'Пользователь успешно зарегистрирован'})

        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Ошибка регистрации'+ e})
        } 

    }
    /**
     * @description Функция авторизации
     * @param {*} req  - запрос методом POST передает логин и пароль
     * @param {*} res  - ответ либо соответсвующая ошибка, либо если логин и пароль верны - генерируем JWT-токен для проверки запросов пользователя.
     * @returns {*} - возвращаем описанные выше ответы
     */
    async login (req, res) {
        try{
            /** получаем логин и пароль */
            const {username, password} = req.body
            /** если пользователя с таким логином нет то возвращаем информацию об этом */
            const user = await User.findOne({username})
            if(!user){
                return res.status(400).json({message: 'Пользователь не найден'})
            }
            /** Проверяем пароль, если не правильный - сообщаем */
            const checkPass = bcrypt.compareSync(password, user.password)
            if (!checkPass) {
                return res.status(400).json({message: 'Неправильный пароль'})
            } 
            /** Если пароль правильный - генерируем и возращаем JWT-токен */
            const token =  generateToken(user._id, user._roles)
            return res.json(token)
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Ошибка логина'+ e})
        } 

    }
}



module.exports = new userController