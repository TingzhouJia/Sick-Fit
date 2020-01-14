import withApollo from 'next-with-apollo';
 import {HttpLink,ApolloLink, ApolloClient} from '@apollo/client';
//import ApolloClient from 'apollo-boost'
import { InMemoryCache } from 'apollo-cache-inmemory';
import {withClientState} from 'apollo-link-state'
import { endpoint, prodEndpoint } from '../config';
import { LOCAL_STATE_QUERY } from '../components/Cart';

const cache = new InMemoryCache();

cache.writeData({data:{cartOpen:false}})
function createClient({ headers }) {
  const auth=new ApolloLink((operation,forward)=>{
    operation.setContext({
      fetchOptions: {
        credentials: 'include',
      },
      headers,
    })
    return forward(operation)
  })
  const client= new ApolloClient({
   cache,
    //uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
    // uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
    link: ApolloLink.from([
      auth,
      
      withClientState({
        defaults:{cartOpen:false},
        resolvers: {
            Mutation: {
              toggleCart:(_, variables, { cache })=> {
                // read the cartOpen value from the cache
                const { cartOpen } = cache.readQuery({
                  query: LOCAL_STATE_QUERY,
                });
                console.log(cartOpen)
                // Write the cart State to the opposite
                const data = {
                  data: { cartOpen: !cartOpen },
                };
                cache.writeData(data);
                return data;
              },
            }
          }
      }),
      new HttpLink({
        uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
      })
    ])   ,
    // request: operation => {
    //     operation.setContext({
    //       fetchOptions: {
    //         credentials: 'include',
    //       },
    //       headers,
    //     });
    //   },
    resolvers: {
        Mutation: {
          toggleCart:(_, variables, { cache })=> {
            // read the cartOpen value from the cache
            const { cartOpen } = cache.readQuery({
              query: LOCAL_STATE_QUERY,
            });
            // Write the cart State to the opposite
            const data = {
              data: { cartOpen: !cartOpen },
            };
            cache.writeData(data);
            return data;
          },
        },
       
        defaults:{
          cartOpen: false,
        }
        
      }
    // request: operation => {
    //   operation.setContext({
    //     fetchOptions: {
    //       credentials: 'include',
    //     },
    //     headers,
    //   });
    // },
    // local data
    
  
  // resolvers: {
  //   mutation: {
  //     toggleCart:(_, variables, { cache })=> {
  //       // read the cartOpen value from the cache
  //       const { cartOpen } = cache.readQuery({
  //         query: LOCAL_STATE_QUERY,
  //       });
  //       // Write the cart State to the opposite
  //       const data = {
  //         data: { cartOpen: !cartOpen },
  //       };
  //       cache.writeData(data);
  //       return data;
  //     },
  //   }
  // }
   
    

     
    
      
    
  });
  return client
}

export default withApollo(createClient);
// import { ApolloClient } from 'apollo-client';
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import { HttpLink } from 'apollo-link-http';
// import { onError } from 'apollo-link-error';
// import { withClientState } from 'apollo-link-state';
// import { ApolloLink, Observable } from 'apollo-link';


// const request=async (operation)=>{
//   operation.setContext({
//     fetchOptions: {
//       credentials: 'include',
//     },
//     headers,
//   });
// }

// const createClient = new ApolloClient({
//   link: ApolloLink.from([
   
//     requestLink,
//     withClientState({
//       defaults: {
//         cartOpen: false,
//       },
     
//         resolvers: {
//           Mutation: {
//             toggleCart(_, variables, { cache }) {
//               // read the cartOpen value from the cache
//               const { cartOpen } = cache.readQuery({
//                 query: LOCAL_STATE_QUERY,
//               });
//               // Write the cart State to the opposite
//               const data = {
//                 data: { cartOpen: !cartOpen },
//               };
//               cache.writeData(data);
//               return data;
//             },
//           },
//         },
//       cache
//     }),
//     new HttpLink({
//       uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
//       credentials: 'include'
//     })
//   ]),
//   cache
// });


