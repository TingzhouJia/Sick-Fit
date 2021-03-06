const {Prisma}=require('prisma-binding')
const db=new Prisma(
   {
    typeDefs:'src/generated/prisma.graphql',
    endpoint:process.env.PRISMA_ENDPOINT,
    secret:process.env.PRISMA_SECRT,
    debug:false
   }
);
//this connect to remote prisma DB and give us ability to query it with JS
module.exports=db
