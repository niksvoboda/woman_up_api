const Task = require('../models/Task')
const uuid = require('uuid')
const path = require('path')

/**
 * @description Реализуем CRUD - endpoints для сущности TODO, 
 * так как более привычно называть их задачами. то далее по тексту  - task
 */
class taskController{
    /**
     * @description - Функция получения списка задач, целиком либо постранично
     * @param {*} req - запрос пользователя методом GET, возможны параметры limit - количество задач на странице и page - конкретная страница для вывода
     * @param {*} res - возвращаем ответ о результате операции
     */
    async readAll(req, res) {
        try{
            /**получаем параметры из запроса */
            let {limit, page} = req.query
            const limit_ = limit || 5
            const page_ = page || 1
            /** вычисляем точку выборки из коллекции tasks в базе данных, для того чтобы не запрашивать лишние данные */
            const offset = limit_*(page_ - 1)
            /** Получаем необходимое количество задач и возвращаем их в ответе */
            const tasks = await Task.find().limit(limit_).skip(offset)
            return res.status(200).json(tasks)
        } catch (e) {
            return res.status(400).json({message: 'Ошибка получения задач'+ e})
        }
    }
    /**
     * @description - Функкиця получения одной задачи, например для использования в форме редактирования на фронтенде
     * @param {*} req запрос пользователя методом GET
     * @param {*} res возвращаем ответ о результате операции
     * @returns 
     */
    async readOne(req, res) {
        try{
            /**получаем ID из запроса */
            const {id} = req.params
            /** Получаем задачу по ID из коллекции tasks */
            const task = await Task.findOne({ _id: id })
            return res.status(200).json(task)
        } catch (e) {
            return res.status(400).json({message: 'Ошибка получения задачи'+ e})
        }
    }
    /**
     * @description Функция создания новой задачи
     * @param {*} req запрос пользователя методом POST, параметры taskname, description
     * @param {*} res возвращаем ответ о результате операции
     */
    async create(req, res) {
        try {
            /** Получаем параметры */
            console.log(req.body)
            const {taskname, description} = req.body
            /** Получаем файл изображения если есть */
            let  filename = 'noimage.jpg'
            if(req.files) {
                const  {img} = req.files
                 /** Генерируем уникальное имя для файла */
                filename = uuid.v4() + ".jpg"
                /** Сохраняем файл в папку static для статических файлов */
                img.mv(path.resolve(__dirname, '..', 'static', filename))
            } 
            /** Сохраняем все данные  в базу  */
            const  newTask = new Task({taskname, description, filename})
            newTask.save((err) => {
               // if (err) return console.log(err);
              })
            return res.status(200).json({message: 'Задача успешно создана'})
        } catch(e){
            return res.status(400).json({message: 'Ошибка создания задачи'+ e})
        }
    }
    /**
     * @description Функция редактирования задачи
     * @param {*} req - запрос методом POST с параметрами задачи id, taskname, description
     * @param {*} res - возвращаем ответ о результате операции
     */
    async update(req, res) {
        try{
            /** Получаем параметры запроса */
            const {id, taskname, description} = req.body
            /** находим запись в базе с данным ID и модифицируем ее */
            Task.findByIdAndUpdate(id, {taskname, description}, (err) => {
                if (err) return console.log(err);
              })
             res.status(200).json({message: 'Задача успешно отредактирована'})
        } catch(e) {
            res.status(400).json({message: 'Ошибка редактирования задачи'+ e})
        }

    }
    /**
     * @description Функция удаления задачи 
     * @param {*} req - запрос методом POST с параметрам id задачи 
     * @param {*} res - возвращаем ответ о результате операции
     */
    async remove(req, res) {
        try{
            /** Получаем параметры запроса */
            const {id} = req.body
            /** находим запись в базе с данным ID и удаляем ее */
            Task.findOneAndDelete({_id: id}, (err) => {
                if (err) return console.log(err);
              })
            res.status(200).json({message: 'Задача успешно удалена'})
        } catch(e) {
            res.status(400).json({message: 'Ошибка удаления задачи'+ e})
        }
    }
}

module.exports = new taskController