const multer = require('multer');
const Product = require('../models/Product');
const Firm = require('../models/Firm');

// Configure storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory where images will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage: storage });

const addProduct = async (req, res) => {

    try {
        const { productName, price, category, bestseller, description } = req.body;
        const image = req.file ? req.file.filename : undefined;
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if (!firm) {
            return req.status(400).json({ error: "No firm founded" })
        }
        const product = new Product({
            productName,
            price,
            category,
            bestseller,
            description,
            firm: firm._id
        })

        const savedProduct = await product.save();
        firm.products.push(savedProduct);
        await firm.save()

        res.status(200).json(savedProduct);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Error Message" })

    }

}

const getProductByFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if (!firm) {
            return res.status(404).json({ error: "No firm founded" });
        }
        const restaurentName = firm.firmName;
        const products = await Product.find({ firm: firmId });

        res.status(200).json({ restaurentName, products });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const deleteProductById = async (req, res) => {
    try {
        const productId = req.params.productId;
        const deleteProduct = await Product.findByIdAndDelete(productId);
        if (!deleteProduct) {
            return res.status(404).json({ error: "No Product Found" });
        }

    } catch (error) {

        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


module.exports = { addProduct: [upload.single('image'), addProduct], getProductByFirm, deleteProductById };


