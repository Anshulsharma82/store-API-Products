const productModel = require('../model/products')

const getProducts = async (req, res) => {
    try {
        const { featured, company, name, sort, fields, numericFilters } = req.query
        const queryObject = {}
        let sortQuery, selectFieldsObj;
        if (featured) {
            queryObject.featured = featured === "true" ? true : false
        }
        if (company) {
            queryObject.company = company
        }
        if (name) {
            queryObject.name = { $regex: name, '$options': 'i' }
        }
        if (numericFilters) {
            //price>40,rating>=4.5
            const operatorMap = {
                '>': '$gt',
                '>=': '$gte',
                '=': '$eq',
                '<': '$lt',
                '<=': '$lte'
            }
            const regex = /\b(>|>=|=|<|<=)\b/g
            let filters = numericFilters.replace(regex,(match)=> `-${operatorMap[match]}-`)
            //  price-$gt-40,rating-$gte-4.5
            const options = ['price','rating']
            filters.split(',').forEach((item) => {
                const [field,operator,value] = item.split('-')
                if(options.includes(field)) {
                    queryObject[field] = { [operator]: Number(value)}
                }
            })
        }
        console.log("queryObject ::::::::::::::::::::::::::::::", queryObject)
        if (sort) {
            // NOTE::::::::::If we have multiple sorting keys in that case order also have impact....

            // if in sort we have -name it means it will sort in descending order, if we have name it will
            // sort in ascending order....
            // if we have multiple sort keys then there should be space in between the keys. 
            // for instance (name -price rating)
            sortQuery = sort.split(',').join(' ')
        }
        else {
            sortQuery = 'createdAt'
        }
        if (fields) {
            selectFieldsObj = fields.split(',').join(' ')
        }
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit
        console.log("SortQuery:::::::::::::::::::::::::", sortQuery)
        console.log('selectFieldsObj::::::::::::::::::::::::::', selectFieldsObj)
        let products = await productModel.find(queryObject).sort(sortQuery).select(selectFieldsObj)
            .skip(skip).limit(limit)
        if (!products) {
            res.status(404).json({ msg: `No products created yet!` })
        }
        res.status(200).json({ products, nbhits: products.length })
    } catch (error) {
        console.log("Error in getProducts:", error)
        res.status(500).json({ err: error })
    }
}

const getProductsStatic = async (req, res, next) => {
    try {
        const search = 'ab'
        const query = { name: { $regex: search, '$options': 'i' } }
        const sortQuery = 'rating' // sort by rating in ascending order.
        const products = await productModel.find(query).sort(sortQuery).select('-_id -company -featured -__v')
        res.status(200).json({ products, nbhits: products.length })

    } catch (error) {
        console.log('Error in getProductsStatic', error)
        res.status(500).json({ msg: error })
    }
}
const createProduct = async (req, res) => {
    try {
        const product = await productModel.create(req.body)
        res.status(201).json(product)
    } catch (err) {
        res.status(500).json({ err: err })
    }
}

module.exports = {
    getProducts,
    getProductsStatic,
    createProduct
}