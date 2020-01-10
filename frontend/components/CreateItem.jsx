import {useMutation,gql} from '@apollo/client'
import Error from './ErrorMessage';
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import React,{useReducer,useCallback} from 'react'
import Router from 'next/router'
import axios from 'axios'
const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;
const CreateItem =()=>{
    const [createOne,{loading,error}]=useMutation(CREATE_ITEM_MUTATION,)
    const datas={title:'',price:0,description:'',image:'',largeImage:''}
  
    const reducer=(state,action)=>{
        switch(action.type){
            case 'title':
                return {...state,title:action.data}
            case 'price':
                return {...state,price:action.data} 
            case 'description':
                return {...state,description:action.data}    
            case 'file':
                return {...state,image:action.data.image,largeImage:action.data.largeImage}
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
    const fileChange=async (e)=>{
        const files=e.target.files
        const data=new FormData()
        data.append('file',files[0])
        data.append('upload_preset','sick-fit')
       const res=await fetch("https://api.cloudinary.com/v1_1/beta-lab/image/upload",{method:'POST',body:data})
       const file = await res.json();
       dispatch({type:'file',data:{image:file.secure_url,largeImage:file.eager[0].secure_url}})
            
      
    }
    return (<Form onSubmit={
        async e=>{
            e.preventDefault();
           
            let data=await createOne({variables:{...states}})
           
            Router.push({pathname:'/items',query:{id:data.id}})
        }
    }>
        <Error error={error}/>
        <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor='file'>File <input type='file' id='file' placeholder="upload file" onChange={fileChange}/></label>
        {states.image&&(<img width='200' src={states.image} alt="upload image" />)}
            <label htmlFor='title'>Title <input type='text' id='title' onChange={titleChange}/></label>
            <label htmlFor='price'>Price <input type='text' id='price' onChange={priceChange}/></label>
            <label htmlFor='description'>Description <textarea id='description' onChange={desChange}/></label>
            <button type="submit">Submit</button>
        </fieldset>
    </Form>)
}
export default CreateItem
export {CREATE_ITEM_MUTATION}