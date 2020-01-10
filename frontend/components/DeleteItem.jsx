import React from 'react'
import {useMutation} from '@apollo/client'
import Router from 'next/router'
import gql from 'graphql-tag'
import ALL_ITEMS_QUERY from './Items'
import Item from './styles/ItemStyles';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;
const DeleteItem=(props)=>{
    
    const [deleteItem]=useMutation(DELETE_ITEM_MUTATION,)
    return(
    <button onClick={ () => {
        if (confirm('Are you sure you want to delete this item?')) {
           deleteItem({variables:{id:props.id}}).catch(err => {
            alert(err.message);
            Router.push('/items')
          });
        }
      }}>{props.children}</button>
    )
}
export default DeleteItem
