import mongoose from 'mongoose';
import { Product } from './src/Models/Product.Models.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MANGODB_URL + '/mangoesDB').then(async () => {
  const products = await Product.find({}, 'name stock');
  console.log(products);
  mongoose.disconnect();
});
