import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { useMutation,useQuery } from '@apollo/client';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import  { CURRENT_USER_QUERY } from './Nav';

function totalItems(cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}
const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

const TakeMyMoney =(props)=>{
    const [createOrder]=useMutation(CREATE_ORDER_MUTATION,{refetchQueries:CURRENT_USER_QUERY})
    const {data,loading}=useQuery(CURRENT_USER_QUERY)
  const onToken = async (res )=> {
    NProgress.start();
    const order = await createOrder({
        variables: {
          token: res.id,
        },
      }).catch(err => {
        alert(err.message);
      });
      console.log(order)
      Router.push({
        pathname: '/order',
        query: { id: order.data.createOrder.id },
      });

  };
    
  if(loading||data.me.cart.length===0)return null
  const me=data.me
  console.log(data)
    return (
     
        
          <StripeCheckout
            amount={calcTotalPrice(me.cart)}
            name="Sick Fits"
            description={`Order of ${totalItems(me.cart)} items!`}
            image={me.cart[0].item && me.cart[0].item.image}
            stripeKey="pk_test_H7FLdwjrY9G6aZxf5PaqsGlD00HZEKmSWC"
            currency="USD"
            email={me.email}
            token={res => onToken(res)}
          >
            {props.children}
          </StripeCheckout>
    )
    
    
  
}

export default TakeMyMoney;
export { CREATE_ORDER_MUTATION };