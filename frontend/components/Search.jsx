import React,{useReducer} from 'react';
import Downshift from 'downshift';
import Router from 'next/router';
import { gql,useApolloClient} from '@apollo/client';

import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';


const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(where: { OR: [{ title_contains: $searchTerm }, { description_contains: $searchTerm }] }) {
      id
      image
      title
    }
  }
`;
const routeToItem=(item)=>{
    Router.push({
      pathname: '/item',
      query: {
        id: item.id,
      },
    });
  }
const AutoCOmplelte=()=>{
    const orign={items:[],loading:false}
    const reducer=(state,payload)=>{
        switch(payload.type){
            case 'items':
                return {...state,items:[...payload.data]}
            case 'loading':
                return {...state,loading:payload.data}
        }
    }
    const [state,setState]=useReducer(reducer,orign)
    console.log(state)
    const client=useApolloClient()
    const handleOnChange = debounce(async (e) => {
        console.log('Searching...');
       
        // turn loading on
       setState({ type: 'loading',data:true });
        // Manually query apollo client
        const res = await client.query({
          query: SEARCH_ITEMS_QUERY,
          variables: { searchTerm: e.target.value },
        });
        await setState({
            type:'items',
          data: res.data.items,
         
        });
        await setState({type:'loading',data:false})
      }, 350);

      return (
        <SearchStyles>
        <Downshift onChange={routeToItem} itemToString={item => (item === null ? '' : item.title)}>
        {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
          <div>
           
              
                <input
                  {...getInputProps({
                    type: 'search',
                    placeholder: 'Search For An Item',
                    id: 'search',
                    className: state.loading ? 'loading' : '',
                    onChange: e => {
                      e.persist();
                     handleOnChange(e);
                    },
                  })}
                />
              
          
            {isOpen && (
              <DropDown>
                {state.items.map((item, index) => (
                  <DropDownItem
                    {...getItemProps({ item })}
                    key={item.id}
                    highlighted={index === highlightedIndex}
                  >
                    <img width="50" src={item.image} alt={item.title} />
                    {item.title}
                  </DropDownItem>
                ))}
                {!state.items.length &&
                  !state.loading && <DropDownItem> Nothing Found {inputValue}</DropDownItem>}
              </DropDown>
            )}
          </div>
        )}
      </Downshift>
      </SearchStyles>
      )
}
export default AutoCOmplelte