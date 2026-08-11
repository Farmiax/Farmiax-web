import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
     farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // References the User model
    required: true,
  },

    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },

    // Price of the package
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Package quantity (e.g., 1, 2, 5)
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // Unit of quantity
    unit: {
      type: String,
      required: true,
      enum: ["g", "kg", "ml", "L", "pcs", "pack"],
    },
    category:{
        type:String,
        require:true
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);
productSchema.plugin(mongooseAggregatePaginate);

export const Product = mongoose.model("Product", productSchema);