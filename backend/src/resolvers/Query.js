const {forwardTo}=require('prisma-binding')

const Query = {
    // async items(parent,args,ctx,info){
    //     //get lists of item
    //     const items=await ctx.db.query.items()
    //     return items
    // }
    items:forwardTo('db')//allow to use the same in prisma and yoga
};

module.exports = Query;
