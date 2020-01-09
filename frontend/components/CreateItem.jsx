import {useMutation,gql} from '@apollo/client'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import React,{useReducer,useCallback,useState} from 'react'
// const CREATE_ITEM_MUTATION=gql`
//     mutation CREATE_ITEM_MUTATION {
//         createItem(
//             title:state.title
//             description:state.
//         )
//     }
// `
const CreateItem =()=>{
    const data={title:'',price:0,description:'',Image:''}
    const [warning,setwarning]=useState(false)
    const reducer=(state,action)=>{
        switch(action.type){
            case 'title':
                return {...state,title:action.data}
            case 'price':
                return {...state,price:action.data} 
            case 'price':
                return {...state,description:action.data}    
        }
    }
    const [state,dispatch]=useReducer(reducer,data)
    const titleChange=useCallback((e)=>{
        dispatch({type:'title',data:e.target.value})
    },[state.title])
    const priceChange= useCallback((e)=>{
        let re = /^[0-9]+.?[0-9]*/
         setwarning(re.test(e.target.value))
        warning?null:dispatch({type:'price',data:e.target.value})
    },[state.price])
    const desChange=useCallback((e)=>{
        dispatch({type:'description',data:e.target.value})
    },[state.description])
   
    console.log(state)
    return (<Form>
        <fieldset>
            <label htmlFor='title'>Title <input type='text' id='title' onChange={titleChange}/></label>
            <label htmlFor='price'>Price <input type='text' id='price' onChange={priceChange}/></label>
            {warning?<p style={{color:'#3A3A3A'}}>Invaild Input!!!</p>:null}
            <label htmlFor='description'>Description <textarea id='description' onChange={desChange}/></label>
        </fieldset>
    </Form>)
}
export default CreateItem