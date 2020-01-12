import React, { Component,useReducer,useCallback } from 'react';
import { useMutation,gql } from '@apollo/client';
import Router from 'next/router'
import Form from './styles/Form';
import Error from './ErrorMessage';


const RESETQEQ_MUTATION = gql`
  mutation RESETQEQ_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;
const RequestReset=props=>{
    let datas={email:'',password:''}
    const reducer=(state,action)=>{
        switch(action.type){
            case 'email':
                return {...state,email:action.data}
         
            case 'reset':
                return {...datas}
        }
    }
    const [reset,{error,loading,called}]=useMutation(RESETQEQ_MUTATION)
    const [state,setState]=useReducer(reducer,datas)
    const saveToState = useCallback(e => {
        setState({ type:e.target.name,data: e.target.value });
       },[])
    return(<Form method="POST"
            onSubmit={async e=>{
                e.preventDefault()
            
                const data=await reset({variables:{...state}})
                console.log(data.data.requestReset.message)
                
                setState({type:'reset'})
                Router.push({pathname:'/reset',query:{resetToken:data.data.requestReset.message}})
            }}>
         <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset Your Password</h2>
              <Error error={error} />
              {!error && !loading && called && <p>Success! Check your email for a reset link!</p>}
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  value={state.email}
                  onChange={saveToState}
                />
              </label>
             
              {/* <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={state.password}
                  onChange={saveToState}
                />
              </label> */}

              <button type="submit">Reset It!</button>
            </fieldset>
    </Form>)
}
export default RequestReset