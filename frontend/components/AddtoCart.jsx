import React from 'react';

import { useMutation,gql } from '@apollo/client';
import {CURRENT_USER_QUERY} from './Nav'
import  Router  from 'next/router';

const ADD_TO_CART_MUTATION = gql`
  mutation addToCart($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`;

const AddToCart =(props)=>{
 
    const { id } =props;
    const [addToCart,{loading}]=useMutation(ADD_TO_CART_MUTATION,{update(cache,{data:{addToCart}}){
        const cartItemId = addToCart.id;
        const data=cache.readQuery({query:CURRENT_USER_QUERY})
        data.me.cart = data.me.cart.concat([cartItemId])
        cache.writeQuery({ query: CURRENT_USER_QUERY, data })}})
   
    return (
     
        <button disabled={loading} onClick={async()=>{
            const d=await addToCart({variables:{id}}) 
           
            Router.push({pathname:'/items',query:{page:1}})
        }}>Add To Cart 🛒</button>
    
    );
  }

export default AddToCart;