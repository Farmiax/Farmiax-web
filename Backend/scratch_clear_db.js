import mongoose from "mongoose";

const clearData = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/mangoesDB');
        console.log('Connected to DB');
        
        // Define a simple schema to point to the 'products' collection
        const Product = mongoose.model('Product', new mongoose.Schema({}), 'products');
        
        const res = await Product.deleteMany({});
        console.log(`Deleted ${res.deletedCount} mock products.`);
        
        process.exit(0);
    } catch (error) {
        console.error("Error clearing data:", error);
        process.exit(1);
    }
};

clearData();
