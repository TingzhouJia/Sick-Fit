import React,{useCallback,useReducer} from 'react'
import {useMutation,gql} from '@apollo/client'
import Error from './ErrorMessage';
import Form from './styles/Form'
import {CURRENT_USER_QUERY} from './Nav'
const SIGNUP_MUTATION = gql`

  mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;
const SignUp=props=>{
    let datas={email:'',name:'',password:''}
    const reducer=(state,action)=>{
        switch(action.type){
            case 'email':
                return {...state,email:action.data}
            case 'name':
                return {...state,name:action.data}
            case 'password':
                return {...state,password:action.data}
            case 'reset':
                return {...datas}
        }
    }
    const [signup,{error,loading}]=useMutation(SIGNUP_MUTATION,{refetchQueries:[{query:CURRENT_USER_QUERY}]})
    const [state,setState]=useReducer(reducer,datas)
    const saveToState = useCallback(e => {
        setState({ type:e.target.name,data: e.target.value });
       },[])
    return(<Form method='POST'
            onSubmit={async e=>{
                e.preventDefault()
                console.log(state)
                await signup({variables:{...state}})
                setState({type:'reset'})
            }}>
         <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign Up for An Account</h2>
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
              <label htmlFor="name">
                Name
                <input
                  type="text"
                  name="name"
                  placeholder="name"
                value={state.name}
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

              <button type="submit">Sign Up!</button>
            </fieldset>
    </Form>)
}
export default SignUp