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
    const [addToCart,{loading}]=useMutation(ADD_TO_CART_MUTATION,{refetchQueries:[CURRENT_USER_QUERY],onCompleted:()=>console.log('finished')})
   
    return (
     
        <button disabled={loading} onClick={async()=>{
            const d=await addToCart({variables:{id}}) 
            console.log(d)
            Router.push({pathname:'/items',query:{page:1}})
        }}>Add To Cart 🛒</button>
    
    );
  }

export default AddToCart;