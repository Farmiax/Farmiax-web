import {Router} from "express";
import {Cashondelivery,getOrders,getuserorder,updatestatus,updateorderrecord ,farmerorderlist} from "../Controlers/Orders.controler.js";
import { verifyjwt } from "../Middleware/auth.middleware.js";

const orderRouter=Router()
orderRouter.route("/cashondelivery").post(Cashondelivery)
orderRouter.route("/getorders").get(getOrders)
orderRouter.route("/getuserorders").get(verifyjwt,getuserorder)
orderRouter.route("/updatestatus").patch(updatestatus)
orderRouter.route("/updateorderrecord").delete(updateorderrecord)
orderRouter.route("/farmerorderlist").get(verifyjwt,farmerorderlist)
export default orderRouter