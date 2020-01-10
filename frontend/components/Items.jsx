import React,{useEffect} from 'react'
import {gql,useQuery} from'@apollo/client'
import styled from 'styled-components'
import Item from './Item.jsx'
import {perPage} from '../config' 
import Pagination from './Pagination'
const ALL_ITEM_QUERY=gql`
    query ALL_ITEM_QUERY($skip: Int = 0,$first: Int = ${perPage}) {
        items(first: $first, skip: $skip, orderBy: id_DESC) {
            id
            title
            price
            description 
            image
            largeImage
        }
    }
`
const Center = styled.div`
  text-align: center;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;
const Items=(props)=>{
    

    const { loading, error, data } = useQuery(ALL_ITEM_QUERY,{variables:{skip: props.query.page*perPage-perPage,fetchPolicy:'network-only'}})
    
  
    
    return (
        <Center>
           

            <Pagination page={props.query.page}/>
           {loading?<p>loading...</p>:(<ItemsList>
                    {data.items.map(item =><Item item={item} key={item.id} />)}
                </ItemsList>)}
            <Pagination page={props.page}/>
        </Center>
    )
}
export default Items
export {ALL_ITEM_QUERY}