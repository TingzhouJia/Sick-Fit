import Link from 'next/link'
import User from './User'
import {gql, useQuery, } from '@apollo/client'
import NavStyles from './styles/NavStyles'
import SignOut from './SignOut'
const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
      #permissions
    #   orders {
    #     id
    #   }
    #   cart {
    #     id
    #     quantity
    #     item {
    #       id
    #       price
    #       image
    #       title
    #       description
    #     }
    #   }
    }
  }
`;
const Nav=props=>{
    const {data,error,loading}=useQuery(CURRENT_USER_QUERY)
    console.log(data)
    if(loading||error){
      return <NavStyles><p>Loading......</p></NavStyles>
    }
    
        
       
      const me = data ? data.me : null
    
      return (
      <NavStyles data-test="nav">
        <Link href="/items">
          <a>Shop</a>
        </Link>
        {me && (
          <>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
            <Link href="/orders">
              <a>Orders</a>
            </Link>
            <Link href="/me">
              <a>Account</a>
            </Link>
            <SignOut/>
            
          </>
        )}
        {!me && (
          <Link href="/signup">
            <a>Sign In</a>
          </Link>

        )}
       
      </NavStyles>
      
    )
        } 
        
   
        
   

export default Nav;
export { CURRENT_USER_QUERY };