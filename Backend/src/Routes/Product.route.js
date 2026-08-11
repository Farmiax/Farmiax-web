import{Router}  from 'express'
import{FarmeraddProduct, AdminlistOfProducts,AdminsingleProduct,FarmerAndAdminUpdateProduct,
     FarmerAndAdminremoveProduct, FarmerGetHisProduct,} from "../Controlers/Product.controler.js"
import { upload } from '../Middleware/Multer.js'
import {adminAuth} from '../Middleware/admin.auth.js'
import { verifyjwt } from '../Middleware/auth.middleware.js'

const routerofProduct= Router()
routerofProduct.route("/all-products").get(AdminlistOfProducts)
routerofProduct.route("/farmer-all-products").get(FarmerGetHisProduct)
routerofProduct.route("/add-product").post(verifyjwt, upload.fields([
        {
        name:"image",
        maxCount:1
    },
        
    ]),FarmeraddProduct)
routerofProduct.route("/admin/:productId").delete(adminAuth,FarmerAndAdminremoveProduct)
routerofProduct.route("/farmer/:productId").delete(verifyjwt,FarmerAndAdminremoveProduct)
routerofProduct.route("/product/:productId").get(AdminsingleProduct)
routerofProduct.route("/update").post(upload.fields([
        {
        name:"image",
        maxCount:1
    },
        
    ]),FarmerAndAdminUpdateProduct)
   
export default routerofProduct