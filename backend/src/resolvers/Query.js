const {forwardTo}=require('prisma-binding')

const Query = {
    // async items(parent,args,ctx,info){
    //     //get lists of item
    //     const items=await ctx.db.query.items()
    //     return items
    // }
    items:forwardTo('db'),//allow to use the same in prisma and yoga
    item: forwardTo('db'),
    itemsConnection:forwardTo('db'),
    me(parent, args, ctx, info) {
      // check if there is a current user ID
      console.log(ctx.request.userId)
      if (!ctx.request.userId) {
        return null;
      }
      return ctx.db.query.user(
        {
          where: { id: ctx.request.userId },
        },
        info
      );
    },
};

module.exports = Query;

