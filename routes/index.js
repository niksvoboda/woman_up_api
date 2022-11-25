const Router  = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const taskController = require('../controllers/taskController')
const authMiddleware = require('../middleware/authMiddleware')

/**
 * список маршрутов приложения
 */
/** Вывод всех задач(постранично либо целиком) */
router.get('/tasks', taskController.readAll)
/** Получение одной задачи  */
router.get('/task/:id', taskController.readOne)
/**Создание новой задачи, проверяем авторизован ли пользователь с помощью authMiddleware */
router.post('/create', authMiddleware, taskController.create)
/**Модификация задачи, проверяем авторизован ли пользовательс помощью authMiddleware */
router.post('/update', authMiddleware, taskController.update)
/**Удаление задачи, проверяем авторизован ли пользователь с помощью authMiddleware */
router.post('/remove', authMiddleware, taskController.remove)
/** Регистрация нового пользователя */
router.post('/registration', userController.registration)
/** Авторизация пользователя */
router.get('/login', userController.login)

module.exports = router