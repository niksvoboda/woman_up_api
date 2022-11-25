const jwt = require('jsonwebtoken')
/**
 * @description Функция проверки авторизации пользователя запрашивающего страницу(middleware)
 * @param {*} req  - запрос
 * @param {*} res  - ответ
 * @param {*} next - функция переадресует запрос далее по цепочке(на следующий middleware или в контроллер)
 * @returns 
 */
module.exports = function(req, res, next){
    if (req.method ==="OPTIONS"){
        next()
    }

    try{
        /** Получаем токен из заголовка, заголовок в формате "Bearer {token}"  */
        const token  = req.headers.authorization.split(' ')[1]
        /** Если токен отсутствует в заголовке то прерываем запрос */
        if (!token) {
            return res.status(403).json({message: "Вы не авторизованы"})
        }
        /** Проверяем токен на валидность и пропускаем запрос далее по цепочке */
        const decodeToken = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decodeToken
        next()

    } catch (e) {
        console.log(e)
        return res.status(403).json({message: "Вы не авторизованы"+ e})
    }
}