import React, { Component } from 'react';
import { Mutation ,gql, useMutation} from '@apollo/client';
import Router from 'next/router'
import { CURRENT_USER_QUERY } from './Nav';

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signout {
      message
    }
  }
`;


const SignOut = props => {
    const [signout]=useMutation(SIGN_OUT_MUTATION,{refetchQueries:[{query:CURRENT_USER_QUERY}]})
   const out=async(e)=>{
        await signout()
        console.log('out')
        Router.push({pathname:'/'})
    }
     return ( <button onClick={out}>Sign Out</button>
        )
};
  export default SignOut;