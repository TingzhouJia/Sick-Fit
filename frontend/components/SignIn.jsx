import React, { Component,useReducer,useCallback } from 'react';
import { useMutation,gql } from '@apollo/client';
import Router from 'next/router';
import Form from './styles/Form';
import Error from './ErrorMessage';
import {CURRENT_USER_QUERY} from './Nav'

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;
const SignIn=props=>{
    let datas={email:'',password:''}
    const reducer=(state,action)=>{
        switch(action.type){
            case 'email':
                return {...state,email:action.data}
           
            case 'password':
                return {...state,password:action.data}
            case 'reset':
                return {...datas}
        }
    }
    const [signin,{error,loading}]=useMutation(SIGNIN_MUTATION,{refetchQueries:[{query:CURRENT_USER_QUERY}]})
    const [state,setState]=useReducer(reducer,datas)
    const saveToState = useCallback(e => {
        setState({ type:e.target.name,data: e.target.value });
       },[])
    return(<Form method="POST"
            onSubmit={async e=>{
                e.preventDefault()
                console.log(state)
                const data=await signin({variables:{...state}})
                console.log(data)
                setState({type:'reset'}
                
                )
                Router.push({pathname:'/',query:{page:1}})
            }}>
         <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign In for An Account</h2>
              <Error error={error} />
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
             
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={state.password}
                  onChange={saveToState}
                />
              </label>

              <button type="submit">Sign In!</button>
            </fieldset>
    </Form>)
}
export default SignIn