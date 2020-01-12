import {useMutation,gql,useQuery} from '@apollo/client'
import Error from './ErrorMessage';
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import React,{useReducer,useCallback} from 'react'
import Router from 'next/router'
const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;
const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION($id: ID!, $title: String, $description: String, $price: Int) {
    updateItem(id: $id, title: $title, description: $description, price: $price) {
      id
      title
      description
      price
    }
  }
`;
const UpdateItem =  (props)=>{
    const [updateOne,{error,loading}]=useMutation(UPDATE_ITEM_MUTATION,)
    let uploading=loading
    let uperror=error

   const {loading,error,data}= useQuery(SINGLE_ITEM_QUERY,{variables:{
    id: props.id,
  }})
    const datas=loading?{title:'',price:'',description:'',id:props.id}:{title:data.item.title,price:data.item.price,description:data.item.description,id:props.id}
  
    const reducer=(state,action)=>{
        switch(action.type){
            case 'title':
                return {...state,title:action.data}
            case 'price':
                return {...state,price:action.data} 
            case 'description':
                return {...state,description:action.data}    
            
        }
    }
    const [states,dispatch]=useReducer(reducer,datas)
    
    const titleChange=useCallback((e)=>{
        dispatch({type:'title',data:e.target.value})
      
    },[])
    const priceChange= useCallback((e)=>{
      dispatch({type:'price',data:e.target.value})
    },[])
    const desChange=useCallback((e)=>{
       
        dispatch({type:'description',data:e.target.value})
    },[])
   
    return (<Form onSubmit={
        async e=>{
            e.preventDefault();
            console.log(states)
            let Data=await updateOne({variables:{...states}})
           
            Router.push({pathname:'/items',query:{id:Data.id}})
        }
    }>
        <Error error={uperror}/>
    {loading?<p>loading...</p>:(data.item?<fieldset disabled={uploading} aria-busy={uploading} >
       <label htmlFor='title'>Title <input type='text' id='title' defaultValue={data.item.title} onChange={titleChange}/></label>
       <label htmlFor='price'>Price <input type='text' id='price' defaultValue={data.item.price} onChange={priceChange}/></label>
       <label htmlFor='description'>Description <textarea id='description' defaultValue={data.item.description} onChange={desChange}/></label>
       <button type="submit">Save Change</button>
   </fieldset>:<p>No Item Found!!</p>)
    }
    </Form>)

    
}
export default UpdateItem
export {UPDATE_ITEM_MUTATION}