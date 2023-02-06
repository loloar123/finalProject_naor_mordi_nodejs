const authAdmin = async(req,res,next) => {
  let token = req.header("x-api-key");
  console.log(1);
  if(!token){
    return res.status(401).json({msg:"You must send token in the header to this endpoint"})
  }
  try{
    // בודק אם הטוקן תקין או בתקוף
    let decodeToken = jwt.verify(token, config.tokenSecret);
    console.log(decodeToken._name);
    let admin = await UserModel.findOne({_id:decodeToken._id});
    // בודק אם הטוקן שייך לאדמין
    if(admin.role != "admin"){
      return res.status(401).json({msg:"Just admin can be in this endpoint"})
    }
    // req -> יהיה זהה בכל הפונקציות שמורשרות באותו ראוטר
    req.tokenData = admin;
    
    // לעבור לפונקציה הבאה בשרשור
    next();
  }
  catch(err){
    return res.status(401).json({msg:"Token invalid or expired"})
  }
}

module.exports = authAdmin;