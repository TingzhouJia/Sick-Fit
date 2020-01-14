import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import {useMutation,useQuery,gql,} from '@apollo/client'
import CartItem from './CartItems';
import calcTotalPrice from '../lib/calcTotalPrice';

import formatMoney from '../lib/formatMoney';
import {CURRENT_USER_QUERY} from './Nav'

const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`;

const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;

const Cart=porps=>{
    const res=useQuery(CURRENT_USER_QUERY,)
    const [toggleCart]=useMutation(TOGGLE_CART_MUTATION)
    const  {data}=useQuery(LOCAL_STATE_QUERY)
    //console.log(res)
    if(!res.data||!res.data.me)return null
    const me=res.data.me
    if(res.loading)return <p>loading....</p>
    return(
        <CartStyles open={data?data.cartOpen:false}
            // const k=client.readQuery({data:LOCAL_STATE_QUERY})
            
            >
            
            <header>
              <CloseButton onClick={toggleCart}  title="close">
                &times;
              </CloseButton>
              <Supreme>{me.name}'s Cart</Supreme>
              <p>You Have {me.cart.length} Item{me.cart.length === 1 ? '' : 's'} in your cart.</p>
            </header>
            <ul>
                {me.cart.map(cartItem => <CartItem key={cartItem.id} cartItem={cartItem} />)}
            </ul>
            <footer>
              <p>{formatMoney(calcTotalPrice(me.cart))}</p>
              <SickButton>Checkout</SickButton>
            </footer>
          </CartStyles>
    )
}
export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };