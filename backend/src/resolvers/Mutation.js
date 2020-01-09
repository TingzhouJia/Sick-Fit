const mutations = {
    async createItem(parent,args,ctx,info){
        //this return promise
        const item=await ctx.db.mutations.createItem({data:{
            ...args
        }},info)
        console.log(item)
        return item;
    }
};

module.exports = mutations;
