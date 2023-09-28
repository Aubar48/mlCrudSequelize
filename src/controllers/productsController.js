/*Base de datos */
const db = require('../database/models')


const fs = require('fs');
const path = require('path');
const { unlinkSync, existsSync } = require('fs');
const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		// Do the magic
		db.Product.findAll()
			.then(products => {
				return res.render('products', {
					products,
					toThousand
				})
			})
			.catch(err => console.log(err))
		// const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		// const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		// Do the magic
		db.Product.findByPk(req.params.id)
			.then(product => {
				return res.render('detail', {
					...product.dataValues,
					toThousand
				})
			})
			// const product = products.find(product => product.id === +req.params.id)
			.catch(err => console.log(err))
	},

	// Create - Form to create
	create: (req, res) => {
		db.Category.findAll()
			.then(categories => {
				return res.render('product-create-form', {
					categories
				})
			}).catch(err => console.log(err))

	},

	// Create -  Method to store
	store: (req, res) => {
		// Do the magic
		const { name, price, discount, description, category } = req.body;
		db.Product.create({
			id: products[products.length - 1].id + 1,
			name: name.trim(),
			price: +price,
			discount: +discount || 0,
			category,
			description: description.trim(),
			image: req.file ? req.file.filename : null,
		}).then(product => {
			console.log(product)
			return res.redirect("/products");
		}).catch(err => console.log(err))

	},


	// Update - Form to edit
	edit: (req, res) => {
		// Do the magic
		const categories = db.Category.findAll()
		const product = db.Product.findByPk(req.params.id)

		Promise.all([categories, product])
			.then(([categories, product]) => {
				return res.render('product-edit-form', {
					...product.dataValues,
					categories, toThousand
				})
			})
			.catch(err => console.log(err))
	},
	// Update - Method to update
	update: (req, res) => {
		// Do the magic
		const { name, price, discount, description, category } = req.body;
		db.Product.findByPk(req.params.id, {
			attributes: ['image']
		})
			.then(product => {
				db.Product.update({
					name: name.trim(),
					price: +price,
					discount: +discount || 0,
					category: category,
					description: description.trim(),
					image: req.file ? req.file.filename : product.image,
				},
					{
						where: {
							id: req.params.id
						}
					}
				)
					.then(() => {
						return res.redirect('/products/detail/' + req.params.id);
					})
					.catch(err => console.log(err));
			});
	},


	// Delete - Delete one product from DB
	destroy: (req, res) => {
		// Do the magic
		db.Product.destroy({
			where: {
				id: req.params.id
			}
		})
			.then(() => {
				console.log("Producto eliminado exitosamente.");
				return res.redirect('/products');
			})
			.catch(err => {
				console.log("Error al eliminar el producto:", err);
				return res.redirect('/products');
			});
	}
}

module.exports = controller