const { check } = require('express-validator')

module.exports = [
    check('title')
        .notEmpty().withMessage('El campo title es obligatorio'),
    check('price')
        .notEmpty().withMessage('El campo price es obligatorio'),
    check('description')
        .notEmpty().withMessage('El campo description es obligatorio'),
    check('categoryId')
        .notEmpty().withMessage('El campo categoryId es obligatorio'),









]