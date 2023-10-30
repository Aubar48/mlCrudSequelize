const paginate = require('express-paginate')
module.exports = {
    listProducts: async (req, res) => {
        try {
            const { count, rows } = getAllProduct(req.query.limit, req.skip)
            const pagesCount = Math.ceil(count / req.query.limit)
            const currentPage = req.query.page
            const pages = paginate.getArrayPages(req)(pagesCount, pagesCount, currentPage)
            return res.status(200).json({
                ok: true,
                meta: {
                    total,
                    pagesCount,
                    currentPage,
                    pages
                },
                data: this.listProducts.map(product => {
                    return {
                        ...product.dataValues,
                        image: `${req.protocol}://${req.get('host')}/images/products/${product.image}`,
                        url: `${req.protocol}://${req.get('host')}/api/products/${product.id}`
                    }
                })
            })

        } catch (error) {
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                error: error.message || 'Upss, hubo un error. Sorry. :('
            })
        }
    },
    showProducts: async (req, res) => {
        try {
            const product = await getproductById(req.params.id)
            return res.status(200).json({
                ok: true,
                data: {
                    ...product.dataValues,
                    image: `${req.protocol}://${req.get('host')}/images/products/${product.image}`,
                }
            })
        } catch (error) {
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                error: error.message || 'Upss, hubo un error. Sorry. :('
            })
        }
    },
    createProducts: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {

                //const errorsMessages = [];
                let errorsMessages = {}
                let objetErrors = errors.mapped()
                for (const key in objetErrors) {
                    //errorsMessages.push(objetErrors[key].msg)
                    errorsMessages = {
                        ...errorsMessages,
                        [objetErrors[key]['path']]: objetErrors[key]['msg']
                    }
                }

                let error = new Error()
                error.status = 400
                error.message = errorsMessages

                throw error

            }

            const data = {
                ...req.body,
                image: req.file ? req.file.filename : null
            }

            const { id } = await createProduct(data);

            const product = await getProductById(id)

            return res.status(200).json({
                ok: true,
                data: {
                    ...product.dataValues,
                    image: `${req.protocol}://${req.get('host')}/images/products/${product.image}`,
                }
            })

        } catch (error) {
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                error: error.message || 'Upss, hubo un error. Sorry. :('
            })
        }
    },
    updateProducts: async (req, res) => {
        try {

        } catch (error) {
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                error: error.message || 'Upss, hubo un error. Sorry. :('
            })
        }
    },
    deleteProducts: async (req, res) => {
        try {

        } catch (error) {
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                error: error.message || 'Upss, hubo un error. Sorry. :('
            })
        }
    }
}