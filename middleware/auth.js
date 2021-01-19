const jwt=require('jsonwebtoken');
const auth=(req,res,next)=>{
try {

  const token=req.header("x-auth-token");

  if(!token){
    return res.status(401).json({msg:"no token authorization access"});
  }

  const verified=jwt.verify(token,process.env.JWT_SECRET);

  if(!verified){
    return res.status(400).json({msg:"Token Not Verified"});
  }
  console.log(verified);
  req.user=verified.id;
  next();
}
catch (e) {
  return res.status(500).json({error:e});

}

};

module.exports=auth;
