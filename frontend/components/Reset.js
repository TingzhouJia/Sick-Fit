import React, { Component,useReducer } from 'react';
import { useMutation,gql } from '@apollo/client';
import Router from 'next/router'
import PropTypes from 'prop-types';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './Nav';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
    resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
      id
      email
      name
    }
  }
`;

const Reset=(props)=> {
  const reducer=(state,action)=>{
      switch(action.type){
            case 'password':
                return {...state,password:action.data}
            case 'confirmPassword':
                return {...state,confirmPassword:action.data}
            case 'reset':
                return {}
      }
  }
  const datas = {
    password: '',
    confirmPassword: '',
    resetToken:props.resetToken
  };
  const [state,setState]=useReducer(reducer,datas)
  const saveToState = e => {
    setState({type:e.target.name,data: e.target.value });
  };
  const [reset, { error, loading, called }]=useMutation(RESET_MUTATION, {refetchQueries:[{ query: CURRENT_USER_QUERY }]})

    return (
    
       
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await reset( {variables:{
                resetToken: state.resetToken,
                password: state.password,
                confirmPassword: state.confirmPassword,
              }});
              setState({ type:'reset'});
              Router.push({pathname:'/'})
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset Your Password</h2>
              <Error error={error} />
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

              <label htmlFor="confirmPassword">
                Confirm Your Password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="confirmPassword"
                  value={state.confirmPassword}
                  onChange={saveToState}
                />
              </label>

              <button type="submit">Reset Your Password!</button>
            </fieldset>
          </Form>
        
 
    )
  }

Reset.propTypes = {
    resetToken: PropTypes.string.isRequired,
  };
export default Reset;