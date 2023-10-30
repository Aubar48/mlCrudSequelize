const { listProducts, showProducts, createProducts, updateProducts, deleteProducts } = require('../controllers/apiProductsController')
const productValidator = require('../validation/productValidator')
const router = require('express').Router()

/* /apis */

/*productos */
router
    .get('/products', listProducts)
    .get('/products/:id', showProducts)
    .post('/products', productValidator, createProducts)
    .put('/products/:id', updateProducts)
    .delete('/products/:id', deleteProducts)
/*usuarios */

/*categorias */

module.exports = router