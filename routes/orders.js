const express = require('express');
const  auth  = require('../middlewares/auth');
const { OrderModel, validateOrder } = require('../models/orderModel');
const { ProductModel } = require('../models/productModel');
const { UserModel } = require('../models/userModel');
const router = express.Router();

router.get("/:id", async(req,res) => {
    let userId = req.params.id;
    try{
            // let mainData = await OrderModel.find({});
            let data = await OrderModel.find({user_id:userId})
            res.json(data);
        
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})


router.post("/", auth , async(req,res)=>{
    console.log(req.tokenData);
    
    let validateBody = validateOrder(req.body);
    if(validateBody.error){
        return res.status(400).json(validateBody.error.details)
    }
    try{
        let order = new OrderModel(req.body);
        let user = await UserModel.findOne({_id:req.tokenData._id});
        
        order.name = user.name;
        order.user_id = user._id;
        
        // לא לשמור בטוקן את המספר טלפון ולא כתובת, לשלןף דרך היוזר איי די את המידע הרגיש של המשתמש
        // להתמש דרך היוזר איי די
        if(order.phone == "" || order.phone == null){
            order.phone = user.phone;
        }
        if(order.city == "" || order.city == null){
            order.city = user.city;
        }
        if(order.address == "" || order.address == null){
            order.address = user.address;
        }
        await order.save();
        res.json(order);
    }
    catch(err){
        console.log(err);
        res.status(502).json(err)
    }
})

router.delete("/:idDel", async (req,res) => {
    try {
        let idDel = req.params.idDel;
        let data = await OrderModel.deleteOne({_id:idDel});
        // deleteOne will delete one and not many
        // if the delete is successful we will recive
        // deleteCount:1
        res.json(data);
    }catch(err){
        console.log(err);
        res.status(502).json({err});
    }
})

// Add to cart(Button)
router.put("/:productId", auth , async(req,res) => {
    let productId = req.params.productId;
    let plusArr = await ProductModel.findOne({_id:productId});
    
})

module.exports = router;
