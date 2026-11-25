import{Router}  from 'express'
import{FarmeraddProduct, AdminlistOfProducts,AdminsingleProduct,FarmerAndAdminUpdateProduct,
     FarmerAndAdminremoveProduct, FarmerGetHisProduct,} from "../Controlers/Product.controler.js"
import { upload } from '../Middleware/Multer.js'
import {adminAuth} from '../Middleware/admin.auth.js'
import { verifyjwt } from '../Middleware/auth.middleware.js'

const routerofProduct= Router()
routerofProduct.route("/all-products").get(AdminlistOfProducts)
routerofProduct.route("/farmer-all-products").post(FarmerGetHisProduct)

routerofProduct.route("/add-product").post(
  verifyjwt,

  (req, res, next) => {
    console.log("STEP 1: JWT AUTH SUCCESS");
    console.log("REQUEST CONTENT TYPE:", req.headers["content-type"]);
    next();
  },

  upload.single("image"),

  (req, res, next) => {
    console.log("STEP 2: MULTER EXECUTED");
    console.log("UPLOADED FILE:", req.file);
    console.log("REQUEST BODY:", req.body);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Multer did not receive image",
        contentType: req.headers["content-type"],
      });
    }

    next();
  },

  FarmeraddProduct
);

routerofProduct.route("/admin/:productId").delete(FarmerAndAdminremoveProduct)
routerofProduct.route("/admin-delete/:productId").post(FarmerAndAdminremoveProduct)
routerofProduct.route("/farmer/:productId").delete(verifyjwt,FarmerAndAdminremoveProduct)
routerofProduct.route("/product/:productId").get(AdminsingleProduct)
routerofProduct.route("/update").post(upload.fields([
        {
        name:"image",
        maxCount:1
    },
        
    ]),FarmerAndAdminUpdateProduct)
   
export default routerofProduct
