import React from 'react'
import {gql,useQuery} from'@apollo/client'
import styled from 'styled-components'
import Item from './Item.jsx'
const ALL_ITEM_QUERY=gql`
    query ALL_ITEM_QUERY {
        items {
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
const Items=()=>{
    const { loading, error, data } = useQuery(ALL_ITEM_QUERY)
    console.log(data)
    return (
        <Center>
           {loading?<p>loading...</p>:(<ItemsList>
                    {data.items.map(item =><Item item={item} key={item.id} />)}
                </ItemsList>)}
            
        </Center>
    )
}
export default Items