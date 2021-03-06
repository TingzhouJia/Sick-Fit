// let's go!
const cookieParser=require('cookie-parser')
const jwt=require('jsonwebtoken')
require('dotenv').config({path:'variables.env'})
const createServer=require('./createServer')
const db=require('./db')
const server= createServer();
server.express.use(cookieParser())
server.express.use((req,res,next)=>{
    if(!req.cookies)return next()
    
    if(req.cookies.token){
        const {userId}=jwt.verify(req.cookies.token,process.env.APP_SECRET)
        
        req.userId=userId
    }
   
    next();
   
})

server.express.use(async (req, res, next) => {
    // if they aren't logged in, skip this
    if (!req.userId) return next();
    const user = await db.query.user(
      { where: { id: req.userId } },
      '{ id, permissions, email, name }'
    );
    req.user = user;
    next();
  });
server.start({
    cors:{
        credentials:true,
        origin:process.env.FRONTEND_URL
    }
},deets=>{console.log(`run on http://localhost:${deets.port}`)})
