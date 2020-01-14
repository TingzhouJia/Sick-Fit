import Link from 'next/link'
import {TOGGLE_CART_MUTATION,LOCAL_STATE_QUERY} from './Cart'
import {gql, useQuery, useApolloClient,useMutation} from '@apollo/client'
import NavStyles from './styles/NavStyles'
import CartCount from './CartCount'
import SignOut from './SignOut'

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
      permissions
      orders {
        id
      }
      cart {
        id
        quantity
        item {
          id
          price
          image
          title
          description
        }
      }
    }
  }
`;
const Nav=props=>{

    const client=useApolloClient()
    const {data,error,loading}=useQuery(CURRENT_USER_QUERY,{fetchPolicy:'network-only'})
    const res=useQuery(LOCAL_STATE_QUERY)
    const [toggle]=useMutation(TOGGLE_CART_MUTATION,{refetchQueries:[CURRENT_USER_QUERY]})
    
    if(loading||error){
      return <NavStyles><p>Loading......</p></NavStyles>
    }
    
    
       
      const me = data ? data.me : null
    
      return (
    <NavStyles data-test="nav">
      <Link href={{pathname:'items',query:{page:'1'}}}>
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
          <Link href="/permissions">
            <a>Account</a>
          </Link>
          <SignOut/>
         <button onClick={toggle}>My Cart
         <CartCount count={me.cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)}></CartCount>
         </button>
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