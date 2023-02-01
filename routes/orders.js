const express = require('express');
const  auth  = require('../middlewares/auth');
const { OrderModel, validateOrder } = require('../models/orderModel');
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
        order.name = req.tokenData.name;
        order.user_id = req.tokenData._id;
        if(order.phone == "" || order.phone == null){
            order.phone = req.tokenData.phone;
        }
        if(order.city == "" || order.city == null){
            order.city = req.tokenData.city;
        }
        if(order.address == "" || order.address == null){
            order.address = req.tokenData.address;
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


module.exports = router;