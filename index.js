const express = require("express");
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoute');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotEnv = require('dotenv');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');

 
const app = express();
const PORT = process.env.PORT || 4000; 

 
dotEnv.config();
app.use(cors())

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Mongoose DB Connected"))
    .catch((error) => console.log(error))

app.use(bodyParser.json()); 
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`); 
})

app.use('/', (req, res) => {
    res.send("Welcome to Restaurent") 
})

