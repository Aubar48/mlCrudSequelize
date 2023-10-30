const db = require('../database/models')
const getAllProducts = async (limit, offset) => {
    try {
        const { count, rows } = await db.Product.findAndCountAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'category_id']
            },
            limit,
            offset,
            include: [
                {
                    association: 'category',
                    attributes: ['name']
                }
            ]
        })
        return {
            total: count,
            products: rows
        }


    } catch (error) {
        console.log(error);
        throw {
            status: error.status || 500,
            message: error.message || "ERROR en el servicio de productos",
        };
    }
}
const getProductById = async () => {
    try {
        if (!id || NaN) {
            throw {
                status: 400,
                message: 'El id no existe'
            }
        }
        const product = await db.Product.findByPk(id, {
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'category_id']
            },
            include: [
                {
                    association: 'category',
                    attributes: ['name']
                }
            ]

        })
        if (!product) {
            throw {
                status: 404,
                message: 'Producto no encontrado'
            }
        }
    } catch (error) {
        console.log(error);
        throw {
            status: error.status || 500,
            message: error.message || "ERROR en el servicio de productos",
        };
    }
}
const createProduct = async (data) => {
    try {
        const newProduct = await db.Product.create(data)
        return newProduct
    } catch (error) {
        console.log(error);
        throw {
            status: error.status || 500,
            message: error.message || "ERROR en el servicio de productos",
        };
    }
}
module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
}