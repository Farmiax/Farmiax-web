import { asyncHandler } from "../Utiles/AscynHandler.js";
import { ApiError } from "../Utiles/ApiError.js";
import { Apiresponse } from "../Utiles/ApiResponse.js";
import { Order } from "../Models/Order.Model.js";
import { User } from "../Models/User.Model.js";
import { Product } from "../Models/Product.Models.js";
import mongoose from "mongoose";

const Cashondelivery = asyncHandler(async (req, res) => {
  try {
    const {
      userId,
      Products,
      totalAmount,
      offerID,
      actualAmount,
      OfferName,
      Discount,
    } = req.body;

    // --------------------------------
    // Validate amounts
    // --------------------------------
    if (totalAmount == null || actualAmount == null) {
      throw new ApiError(400, "Total amount and actual amount are required");
    }

    if (Number(totalAmount) < 0 || Number(actualAmount) < 0) {
      throw new ApiError(400, "Amount cannot be negative");
    }

    // --------------------------------
    // Validate user ID
    // --------------------------------
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Invalid user ID");
    }

    // --------------------------------
    // Check user exists
    // --------------------------------
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // --------------------------------
    // Validate Products array
    // --------------------------------
    if (!Array.isArray(Products) || Products.length === 0) {
      throw new ApiError(400, "Products must be a non-empty array");
    }

    // --------------------------------
    // Validate each product
    // --------------------------------
    for (const item of Products) {
      if (!item.product) {
        throw new ApiError(400, "Product ID is required");
      }

      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        throw new ApiError(400, `Invalid product ID: ${item.product}`);
      }

      if (
        item.quantity == null ||
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) < 1
      ) {
        throw new ApiError(400, "Product quantity must be at least 1");
      }

      if (item.price == null || Number(item.price) < 0) {
        throw new ApiError(
          400,
          "Product price must be greater than or equal to 0",
        );
      }
    }

    // --------------------------------
    // Prevent duplicate products
    // --------------------------------
    const productIds = Products.map((item) => item.product.toString());

    const uniqueProductIds = [...new Set(productIds)];

    if (uniqueProductIds.length !== productIds.length) {
      throw new ApiError(400, "Duplicate products are not allowed");
    }

    // --------------------------------
    // Get products from DB
    // --------------------------------
    const productsFromDB = await Product.find({
      _id: {
        $in: uniqueProductIds,
      },
    }).populate("farmer", "_id farmeractive");

    // --------------------------------
    // Check products exist
    // --------------------------------
    if (productsFromDB.length !== uniqueProductIds.length) {
      const foundProductIds = new Set(
        productsFromDB.map((product) => product._id.toString()),
      );

      const missingProductIds = uniqueProductIds.filter(
        (productId) => !foundProductIds.has(productId.toString()),
      );

      throw new ApiError(
        404,
        `Product(s) not found: ${missingProductIds.join(", ")}`,
      );
    }

    // --------------------------------
    // Create product map
    // --------------------------------
    const productMap = new Map();

    for (const product of productsFromDB) {
      productMap.set(product._id.toString(), product);
    }

    // --------------------------------
    // Validate farmer + stock
    // --------------------------------
    for (const item of Products) {
      const product = productMap.get(item.product.toString());

      if (!product) {
        throw new ApiError(404, `Product not found: ${item.product}`);
      }

      // Farmer check
      if (!product.farmer) {
        throw new ApiError(400, `Farmer not found for product ${product._id}`);
      }

      if (product.farmer.farmeractive !== "Active") {
        throw new ApiError(
          403,
          `Farmer is inactive for product ${product._id}`,
        );
      }

      // --------------------------------
      // Stock check
      // --------------------------------
      const requestedQuantity = Number(item.quantity);

      const availableStock = Number(product.stock);

      if (availableStock <= 0) {
        throw new ApiError(400, `Stock is empty for product ${product._id}`);
      }

      if (requestedQuantity > availableStock) {
        throw new ApiError(
          400,
          `Only ${availableStock} item(s) available for product ${product._id}`,
        );
      }
    }

    // --------------------------------
    // Prepare order products
    // --------------------------------
    const orderProducts = Products.map((item) => {
      const product = productMap.get(item.product.toString());

      return {
        product: product._id,

        // Don't trust farmerId from frontend
        farmerId: product.farmer._id,

        quantity: Number(item.quantity),

        price: Number(item.price),
      };
    });

    // --------------------------------
    // Create offer
    // --------------------------------
    const offer = {
      offerID: offerID || "",
      OfferName: OfferName || "",
      Discount: Number(Discount) || 0,
    };

    // --------------------------------
    // Reduce stock atomically
    // --------------------------------
    for (const item of Products) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.product,

          // Very important:
          // update only if enough stock exists
          stock: {
            $gte: Number(item.quantity),
          },
        },
        {
          $inc: {
            stock: -Number(item.quantity),
          },
        },
        {
          returnDocument: "after",
        },
      );

      if (!updatedProduct) {
        throw new ApiError(
          409,
          `Insufficient stock for product ${item.product}`,
        );
      }
    }

    // --------------------------------
    // Create order
    // --------------------------------
    const orderData = {
      user: userId,

      Products: orderProducts,

      Offer: offer,

      actualAmount: Number(actualAmount),

      totalAmount: Number(totalAmount),

      orderDate: new Date(),

      status: "Order Placed",

      paymentMethod: "COD",

      payment: false,
    };

    const order = await Order.create(orderData);

    if (!order) {
      throw new ApiError(500, "Something went wrong while placing order");
    }

    // --------------------------------
    // Clear cart
    // --------------------------------
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          cartData: {},
        },
      },
      {
        returnDocument: "after",
      },
    );

    // --------------------------------
    // Response
    // --------------------------------
    return res
      .status(201)
      .json(new Apiresponse(201, order, "Order placed successfully"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          null,
          error.message || "Something went wrong at fetching all orders",
        ),
      );
  }
});
const Rezorpay = asyncHandler(async (req, res) => {});
const stripepayment = asyncHandler(async (req, res) => {});
const getOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate(
        "user",
        "-password -refreshToken -accessToken -cartData -wishlist -role -farmeractive ",
      )
      .populate("Products.product", " -stock -createdAt -updatedAt -farmer")
      .populate(
        "Products.farmerId",
        "-password -refreshToken -accessToken -cartData -wishlist",
      );
    if (!orders) {
      throw new ApiError(404, "No orders found");
    }
    return res
      .status(302)
      .json(new Apiresponse(302, orders, "all orders fetched successfully"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          null,
          error.message || "Something went wrong at fetching all orders",
        ),
      );
  }
});
const getuserorder = asyncHandler(async (req, res) => {
  try {
    const user = req.user._id;
    const orders = await Order.find({ user })
      .populate("Products.product", " -stock -createdAt -updatedAt -farmer")
      .populate(
        "Products.farmerId",
        "-password -refreshToken -accessToken -cartData -wishlist -role -farmeractive",
      );
    if (!orders) {
      throw new ApiError(404, "No orders found for this user");
    }

    return res
      .status(302)
      .json(new Apiresponse(302, orders, "user orders fetched successfully"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          null,
          error.message || "Something went wrong at fetching user orders",
        ),
      );
  }
});
const updatestatus = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body;
  try {
    if (!orderId || !status) {
      throw new ApiError(400, "orderId and status are required");
    }
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new ApiError(400, "Invalid order ID");
    }
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { returnDocument: "after" },
    );
    if (!order) {
      throw new ApiError(404, "Order not found");
    }
    return res
      .status(201)
      .json(new Apiresponse(201, order, "Order status updated successfully"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          null,
          "Something went wrong while updating order status",
        ),
      );
  }
});
const updateorderrecord = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  try {
    if (!orderId) {
      throw new ApiError(400, "OrderId is required");
    }
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new ApiError(400, "Invalid order ID");
    }

    const respons = await Order.findByIdAndDelete(orderId);

    return res
      .status(200)
      .json(new Apiresponse(200, respons, "Delete the order"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          null,
          "Something went wrong while deleting order ",
        ),
      );
  }
});
const farmerorderlist = asyncHandler(async (req, res) => {
  try {
    const farmerId = req.user._id;
    const OrderofFarmer = await Order.find({
      Products: {
        $elemMatch: {
          farmerId: farmerId,
        },
      },
    })
      .populate(
        "user",
        "-password -refreshToken -accessToken -cartData -wishlist -role -farmeractive",
      )
      .populate("Products.product", "-stock -createdAt -updatedAt -farmerId");

    return res
      .status(200)
      .json(
        new Apiresponse(
          200,
          OrderofFarmer,
          "Farmer orders fetched successfully",
        ),
      );
  } catch (error) {
    const status = error.statusCode || 500;

    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          null,
          error.message || "Something went wrong while fetching orders",
        ),
      );
  }
});
export {
  Cashondelivery,
  getOrders,
  getuserorder,
  updatestatus,
  updateorderrecord,
  farmerorderlist,
};
