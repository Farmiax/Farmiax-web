import { asyncHandler } from "../Utiles/AscynHandler.js";
import { ApiError } from "../Utiles/ApiError.js";
import {
  UploudOnCloundinary,
  destroyoncloundinary,
} from "../Utiles/cloundinary.js";
import { Apiresponse } from "../Utiles/ApiResponse.js";
import { Product } from "../Models/Product.Models.js";
import mongoose from "mongoose";
import fs from "fs";

const FarmeraddProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      quantity,
      unit,
      stock,
      farmerId,
      Category,
    } = req.body;
    const imagePath = req.files?.image?.[0]?.path;
    if (!imagePath) {
      throw new ApiError(400, "Product image is required");
    }

    if (
      !name ||
      !description ||
      !price ||
      !quantity ||
      !unit ||
      !farmerId ||
      !Category
    ) {
      if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
     throw new ApiError(400, "All fields are required");
    }
    

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
        if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
      throw new ApiError(400, "Product already exists");
    }

    const uploadedImage = await UploudOnCloundinary(imagePath);

    if (!uploadedImage) {
      throw new ApiError(500, "Image upload failed");
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      quantity: Number(quantity),
      unit,
      stock: Number(stock) || 0,
      image: uploadedImage.url,
      farmer: farmerId,
      category: Category,
    });

    return res
      .status(201)
      .json(new Apiresponse(201, product, "Product added successfully"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json(new Apiresponse(status, null, error.message || "Failed to add product"));
  }
});

// ===================== Get All Products for admin and home =====================
const AdminlistOfProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find();
    if(products.length===0){
      throw new ApiError(404,"No products found");
    }

    return res
      .status(302)
      .json(new Apiresponse(302, products, "Products fetched successfully"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json(new Apiresponse(status, null, error.message || "Failed to fetch products"));
  }
});

// ===================== Get Single Product to admin with full detail of farmer =====================
const AdminsingleProduct = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    

    if (!mongoose.isValidObjectId(productId)) {
      throw new ApiError(400,"Invalid Product ID");
    }

    const product = await Product.findById(productId).populate("farmer" ,"-password -refreshToken -accessToken -cartData -wishlist -role ")

    if (!product) {
      throw new ApiError(404,"Product is not found")
    }

    return res
      .status(302)
      .json(new Apiresponse(302, product, "Product fetched successfully"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json(new Apiresponse(status, null, error.message|| "Something went wrong when fatching a product"));
  }
});

// ===================== Update Product both update =====================
const FarmerAndAdminUpdateProduct = asyncHandler(async (req, res) => {
  try {
    const {
      productId,
      name,
      description,
      price,
      quantity,
      unit,
      stock,
      farmerId,
      Category,
    } = req.body;
    if (
      !name ||
      !description ||
      !price ||
      !quantity ||
      !unit ||
      !farmerId ||
      !Category
    ) {
       if (fs.existsSync(req.file?.path)) {
              fs.unlinkSync(req.file?.path);
            }
      
     throw new ApiError(400,"All fields are required");
     
    }

    if (!mongoose.isValidObjectId(productId)) {
      if (fs.existsSync(req.file?.path)) {
              fs.unlinkSync(req.file?.path);
            }
      throw new ApiError(400,  "Invalid Product ID");
      
    }

    const oldProduct = await Product.findById(productId);

    if (!oldProduct) {
      if (fs.existsSync(req.file?.path)) {
              fs.unlinkSync(req.file?.path);
            }
      throw new ApiError(404,"old Product is not found");
      
    }

    let imageUrl = oldProduct.image;

    if (req.file?.path) {
      const publicId = oldProduct.image.split("/").pop().split(".")[0];

      await destroyoncloundinary(publicId);

      const uploadedImage = await UploudOnCloundinary(req.file.path);

      if (uploadedImage) {
        imageUrl = uploadedImage.url;
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        price: Number(price),
        quantity: Number(quantity),
        unit,
        stock: Number(stock),
        image: imageUrl,
        farmer: farmerId,
        category: Category,
      },
      {
        returnDocument: "after",
      },
    );

    return res
      .status(205)
      .json(
        new Apiresponse(205, updatedProduct, "Product updated successfully"),
      );
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json(new Apiresponse(status, null, error.message
      || "Something went wrond when updating a product"
    ));
  }
});

// ===================== Delete Product =====================
const FarmerAndAdminremoveProduct = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
      throw new ApiError(400," Invalid Product Id");
      
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new ApiError(404,"Product is not found");
      
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      await destroyoncloundinary(publicId);
    }

    await Product.findByIdAndDelete(productId);
    

    return res
      .status(205)
      .json(new Apiresponse(205, null, "Product deleted successfully"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json(new Apiresponse(status, null, error.message|| " something went wrong when deleting a product"));
  }
});
const FarmerGetHisProduct = asyncHandler(async (req, res) => {
  try {
    const { farmerId } = req.body;
    if (!mongoose.isValidObjectId(farmerId)) {
       throw new ApiError(400,"Invalid Farmer ID");
       
    }
    const allProducts = await Product.find({ farmer: farmerId });
    if (allProducts.length === 0) {
       throw new ApiError(404,"Products are not found");
       
    }
    return res
      .status(302)
      .json(
        new Apiresponse(302, allProducts, "Successfull fetching all products"),
      );
  } catch (error) {
    const status = error.statusCode || 500
    return res.status(status).json(new Apiresponse(status, [], error.message || "Something went wrong when fetching all products"));
  }
});

export {
  FarmeraddProduct,
  AdminlistOfProducts,
  AdminsingleProduct,
  FarmerAndAdminUpdateProduct,
  FarmerAndAdminremoveProduct,
  FarmerGetHisProduct,
};
