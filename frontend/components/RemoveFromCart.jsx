import React from 'react';
import { useMutation,gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { CURRENT_USER_QUERY } from './Nav';
import Router  from 'next/router';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromCart($id: ID!) {
    removeFromCart(id: $id) {
      id
      __typename
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

const RemoveFromCart=(props)=>{
    const [removeFromCart,{loading}]=useMutation(REMOVE_FROM_CART_MUTATION,{update(cache,{data:{removeFromCart}}){
        const cartItemId = removeFromCart.id;
        const data=cache.readQuery({query:CURRENT_USER_QUERY})
        data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);
        cache.writeQuery({ query: CURRENT_USER_QUERY, data });
    },optimisticResponse:{
        __typename: 'Mutation',
        removeFromCart: {
          __typename: 'CartItem',
          id: props.id,
        },
      }})
 
    return (
      
          <BigButton
            disabled={loading}
            onClick={ () => {
                removeFromCart({variables:{ id: props.id }}).catch(err => alert(err.message));
              //Router.push({pathname:'/items',query:{page:1}})
            }}
            title="Delete Item"
          >
            &times;
          </BigButton>
      
    );
  
}
RemoveFromCart. propTypes = {
    id: PropTypes.string.isRequired,
  };
export default RemoveFromCart;