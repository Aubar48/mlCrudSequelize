/*Base de datos */
const db = require('../database/models')
const { Op } = require('sequelize')
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		// Do the magic con base de datos
		const productsVisited = db.Product.findAll({
			where: {
				categoryId: 1
			}
		});
		const productsInSale = db.Product.findAll({
			where: {
				categoryId: 2
			}
			/* JSON formato viejo */
			// return res.render('index', {
			// 	productsVisited: products.filter(product => product.category === "visited"),
			// 	productsInSale: products.filter(product => product.category === "in-sale"),
			// 	toThousand
			// })
		});
		Promise.all([productsVisited, productsInSale])
			.then(([productsVisited, productsInSale]) => {
				return res.render('index', {
					productsVisited,
					productsInSale,
					toThousand
				})
			})
			.catch(err => console.log(err))
		/*lo que va afuera de la promesa se ejecuta primero */
	},
	search: (req, res) => {
		// Do the magic
		db.Product.findAll({
			where: {
				[Op.or]: [
					{
						name: {
							[Op.substring]: req.query.keywords
						}
					},
					{
						description: {
							[Op.substring]: req.query.keywords
						}
					}
				]
			}
		})
			.then(results => {
				return res.render('results', {
					results,
					toThousand,
					keywords: req.query.keywords
				})
			})
			.catch(err => console.log(err))
		// const results = products.filter(products => products.name.toLowerCase().includes(req.query.keywords.toLowerCase()))
	},
}

module.exports = controller;
