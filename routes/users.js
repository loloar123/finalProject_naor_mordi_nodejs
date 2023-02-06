const express= require("express");
const bcrypt = require("bcrypt");
const {UserModel,validateUser, validateLogin,createToken} = require("../models/userModel");
const auth = require("../middlewares/auth");

const router = express.Router();

// מאזין לכניסה לראוט של העמוד בית לפי מה שנקבע לראוטר
// בקובץ הקונפיג

// add an auth to detect wich user is entering the get request
router.get("/", async(req,res) => {
  res.json({msg:"Users end point , docs: ..."});
})

router.get('/' , auth , async(req,res) => {
  
  try{
    if(req.tokenData.role == "admin"){
      let data = await UserModel.find({});
      res.json(data);
    }else{
      return res.status(401).json({msg:"Not found"});
    }
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
  

})



// auth -> פונקציית מידל וואר שפועלת ראשונה ואם מצליחה מפעילה נקסט שמפעיל את הפונקציה
// הבאה בשרשור של הראוטר
router.get("/userInfo", auth, async(req,res) => {

  try{
    // req.tokenData -> מגיע מהפונקציה הקודמת שאספה לתוכו את המדיע של הטוקן שיש בו איי די של משתמש
    let data = await UserModel.findOne({_id:req.tokenData._id},{password:0})
    res.json(data);
    // res.json({msg:"success. ",tokenData:req.tokenData})
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

// sign up
router.post("/", async(req,res) => {
  // בודק אם הבאדי שמגיע מצד לקוח תקין
  let validBody = validateUser(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    user.password = "******";
    res.status(201).json(user);
  }
  catch(err){
    // דורש שבקומפס נגדיר באינדקס של המייל שהוא יוניקי
    // 11000 -> מאפיין קיים כבר במערכת במקרה שלנו המייל ככה שצד לקוח
    // יידע שהשגיאה היא שהמייל כבר קיים במערכת
    if(err.code == 11000){
      return res.status(400).json({msg:"Email already in system",code:11000})
    }
    console.log(err);
    res.status(502).json({err})
  }
})

// users/login
router.post("/login", async(req,res) => {
  let validBody = validateLogin(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{

    //  אם בכלל קיים מייל שנשלח בבאדי במסד
    let user = await UserModel.findOne({username:req.body.username});
    if(!user){
      return res.status(401).json({msg:"Username not found, sign up!"});
    }
    // אם הסיסמא המוצפנת של הרשומה שנמצא לפי המייל מתאימה לסיסמא בבאדי
    let passValid = await bcrypt.compare(req.body.password, user.password)
    if(!passValid){
      return res.status(401).json({msg:"Password worng!"});
    }
    let token = createToken(user._id)
    // token -> אם השם של המאפיין זהה לשם של משתנה או פרמטר בבלוק של פונקציה
    // אין צורך לעשות נקודתיים ולכתוב אותו שוב shorhad props object
    // res.json({token:token})
    res.json({token})
    // res.json({msg:"Success, need to send you token later"})
  }
  catch(err){
    console.log(err);
    res.status(502).json({msg:"There problem, come back later"})
  }

  // לשלוח טוקן
})


module.exports = router;