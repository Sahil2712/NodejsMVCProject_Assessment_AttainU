const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User=require('../models/UserModel');
const auth=require('../middleware/auth');
const jwt = require("jsonwebtoken");
const imageFunc = require('../middleware/image');
const jsonpatch = require('json-patch');


/*
  Author:Sahil Rajeev Naik
  Date:19/01/2021
  @desc Testing the routes via nodejs
  @router /users/
  @type:GET
*/
router.get('/',(req,res) => {
  res.json({
      message: "Welcome to the API"
  })
});
/*
  Author:Sahil Rajeev Naik
  Date:19/01/2021
  @desc Registration via userName
  @router /users/signup
  @type:Post
*/

router.post('/signup',async(req,res,next)=>{

  var {userName,password,passwordCheck,CreatedAt}=req.body;

  try {

      if(!userName|| !password || !passwordCheck){

        return res
        .status(400)
        .json({msg:"Please Fill all the fields"});

      }
      if(password.length<5){

        return res
        .status(400)
        .json({msg:"Please Enter Password of length More than 5"});

      }
      if(password!==passwordCheck){

        return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification." });

      }


      const existingUser=await User.findOne({userName:userName});

      if(existingUser){
      return   res
      .status(400)
      .json({msg:"userName already exits"});

      }
      if(userName>10){
      return  res
      .status(400)
      .json({msg:"Please Enter Username of length below 10"});

      }
      // bcrypt Password with a String

      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      // Values Stored in new User
      const newUser = new User({
        userName,
        password:passwordHash,
        CreatedAt
    });
    // Values Stored to Database

    const savedUser=await newUser.save();

    res.json(savedUser);

  }
  catch (err) {
    return res.status(500).json({error:err.message});
  }

});//End of signup route


/*
  Author:Sahil Rajeev Naik
  Date:19/01/2021
  @desc Signin via userName
  @router /users/signin
  @type:Post
*/

router.post('/signin', async (req,res)=>{
  try {
      const {userName,password}=req.body;

      if(!userName || !password){
        return res
        .status(400)
        .json({msg:"Please Fill all the fields"});

      }
      const user=await User.findOne({userName:userName});

      if(!user){
        return res
        .status(400)
        .json({msg:"No User Account Exists"});

      }

      const isMatch=await bcrypt.compare(password,user.password);
      if(!isMatch){
        return res
        .status(400)
        .json({msg:"Please Enter the correct password"});

      }
      // It will produce the jwt secret token of the particular user
      const refreshTokens =jwt.sign({id:user._id},process.env.JWT_SECRET);
      res.json({
      refreshTokens,
        user:{
          id:user._id,
          userName:user.userName
        }
      });

  }
    catch (err) {
    res.status(400).json({error:err.message});
  }
});//End of route signin

/*
  Author:Sahil Rajeev Naik
  Date:19/01/2021
  @desc To Check Whether token is valid or not
  @router /users/tokenIsValid
  @type:Post
*/

router.post('/tokenIsValid',async(req,res)=>{
    try {
        const token =req.header('x-auth-token');
        if(!token){
          res.json(false);
        }
        const verified=jwt.verify(token,process.env.JWT_SECRET);
        if(!verified){
          return res.status(400).json(false);
        }
        const user=await User.findById(verified.id);
        if(!user){
          return res.json(false);
        }
        return res.json(true);
    } catch (e) {
        res.status(500).json({error:err.message});
    }
});//End of ROute tokenIsValid

/*
  Author:Sahil Rajeev Naik
  Date:19/01/2021
  @desc To Create thumbnail
  @router /users/image
  @type:Post
*/
router.post('/image', auth, imageFunc, (req,res) => { }) //End of Router Image Used for thumbnail creation;

/*
  Author:Sahil Rajeev Naik
  Date:19/01/2021
  @desc  JSON patch describing changes in a JSON document
  @router /users/jsonPatch
  @type:Post
*/
router.post('/jsonpatch', auth, (req,res) => {
    jsonpatch.apply(req.body.jsonObject,req.body.jsonPatch);
    res.json({
        Patched: req.body.jsonObject
    });
});//End of Route Json Patch

module.exports=router;
