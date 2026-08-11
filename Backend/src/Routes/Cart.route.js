import{Router}  from 'express'
import {addToCart,updateCart, getUserCart}from "../Controlers/Cart.controler.js"
import { verifyjwt } from '../Middleware/auth.middleware.js'
const cartrouter=Router()
cartrouter.route('/get').get(verifyjwt,getUserCart)
cartrouter.route('/add').post(verifyjwt,addToCart)
cartrouter.route('/update').patch(verifyjwt,updateCart)
export default cartrouter
