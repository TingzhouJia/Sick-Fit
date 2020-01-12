import React from 'react'
import {useMutation} from '@apollo/client'
import Router from 'next/router'
import gql from 'graphql-tag'
import {ALL_ITEM_QUERY} from './Items'


const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;
const DeleteItem=(props)=>{
    
    const [deleteItem]=useMutation(DELETE_ITEM_MUTATION,{
        update(cache, {data:{deleteItem}}) {
            
            // manually update the cache on the client, so it matches the server
            // 1. Read the cache for the items we want
            const data = cache.readQuery({ query: ALL_ITEM_QUERY });
            console.log(data);
            // 2. Filter the deleted itemout of the page
            data.items = data.items.filter(item => item.id !== deleteItem.id);
            // 3. Put the items back!
            cache.writeQuery({ query: ALL_ITEM_QUERY, data });
          }
    })
    return(
    <button onClick={ () => {
        if (confirm('Are you sure you want to delete this item?')) {
           deleteItem({variables:{id:props.id}}).catch(err => {
            alert(err.message);
            Router.push('/items?page=1')
          });
        }
      }}>{props.children}</button>
    )
}
export default DeleteItem
