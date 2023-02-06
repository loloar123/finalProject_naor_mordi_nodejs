const express= require("express");
const auth = require("../middlewares/auth");
const { validateProduct, ProductModel } = require("../models/productModel");
const router = express.Router();

router.get("/", async(req,res) => {
  let data = await ProductModel.find({});
  res.json(data)
})

router.post('/', auth , async(req,res) => {
  if(req.tokenData.role != "admin"){
    return res.status(400).json({msg:"Your not an admin!"});
  }
  let validBody = validateProduct(req.body);
  if(validBody.error){
    return res.status(401).json(validBody.error.details);
  }
  try{
    let product = new ProductModel(req.body);
    await product.save();
    res.json(product);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.put("/:id", auth, async(req,res) => {
  if(req.tokenData.role != "admin"){
    return res.status(400).json({msg:"Your not an admin!"});
  }
  try{
    let idPut = req.params.id;
    let product = await ProductModel.updateOne({_id:idPut}, req.body);
    res.json(product);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.delete("/:idDel" , auth , async(req,res) => {
  if(req.tokenData.role != "admin"){
    return res.status(400).json({msg:"Your not an admin!"});
  }
  let idDelete = req.params.idDel;
  let product = await ProductModel.deleteOne({_id:idDelete});
  res.json(product);
})


module.exports = router;
