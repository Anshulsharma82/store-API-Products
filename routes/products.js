const express = require('express')
const router = express.Router()
const { getProducts, getProductsStatic ,createProduct } = require('../controllers/products')

router.route('/').get(getProducts).post(createProduct)
router.route('/static').get(getProductsStatic)

module.exports = router