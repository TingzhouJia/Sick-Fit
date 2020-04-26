# Sick-Fit E-commerce
### Technology Stack:
- [Hooks](https://github.com/facebook/react) -New feature of React, kill the redundancy in components :smiley: and no "life-cycle" anymore :star2::star2: 
- [Next.js](https://nextjs.org/)  - Enable SSR and better SEO for React app :+1::+1::+1:
- [GraphQL](https://graphql.org/) -API gateway :blush:
- [Apollo](https://www.apollographql.com/docs/react/) - Responsible for state management, a good replacement of Redux :heart_eyes:
- [Prisma](https://www.prisma.io/) - Accress to Database with nodejs and typescript :wink:

### How to use:
1. First copy the repo into your disk:
```shell
$ git clone https://github.com/TingzhouJia/Sick-Fit.git
```
2. Register your account in [Prisma](https://app.prisma.io/)
3. Then you can replace original config with your own file :innocent:
### FRONT END

- Setup Apollo with Nextjs
```javascript
import withApllo from 'next-with-apollo'
import ApolloClient from 'apollo-boost'
import {endpoint} from './config'

const createClient=({header})=>{
    return new ApolloClient({
        url:process.env.NODE_ENV==='development'?endpoint:endpoint,
        request:operation=>{
            operation.setContext({
                fetchOptions:{credentials:'include',},
                header
            })
        }
    })
}
export default withApllo(createClient);
```
- [Custom Apollo-client](https://www.apollographql.com/docs/react/)
```javascript
import withApollo from 'next-with-apollo';
import {HttpLink,ApolloLink, ApolloClient} from '@apollo/client';
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
    link: ApolloLink.from([
      auth,     
      withClientState({
        defaults:{cartOpen:false},
        resolvers: {
            Mutation: {
              toggleCart:(_, variables, { cache })=> {
              
                const { cartOpen } = cache.readQuery({
                  query: LOCAL_STATE_QUERY,
                });
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
    ]),
    resolvers: {
        Mutation: {
          toggleCart:(_, variables, { cache })=> {
          
            const { cartOpen } = cache.readQuery({
              query: LOCAL_STATE_QUERY,
            });
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
  });
  return client
}

export default withApollo(createClient);
```
### BACK END
- [Create server by using graphql-yoga](https://github.com/prisma-labs/graphql-yoga)
```javascript
const {GraphQLServer}=require('graphql-yoga')
const Mutation=require('./resolvers/Mutation')
const Query=require('./resolvers/Query')
const db=require('./db')
const createServer=()=>{
    return new GraphQLServer({
        typeDefs:'src/schema.graphql',
        resolvers:{
            Mutation,Query
        },
        resolverValidationOptions:{
            requireResolversForResolveType:false
        },
        context:req=>({...req,db})
    })
}
```
- [Connect your server to Prisma database](https://www.prisma.io/)
```javascript
const {Prisma}=require('prisma-binding')
const db=new Prisma(
   {
    typeDefs:'src/generated/prisma.graphql',
    endpoint:process.env.PRISMA_ENDPOINT,
    secret:process.env.PRISMA_SECRT,
    debug:false
   }
);
//this connect to remote prisma DB and give us ability to query it with JS
module.exports=db
```
- Generate your schema with GraphQL
```javascript
type SuccessMessage {
  message: String
}

type Mutation {
  createItem(title: String, description: String, price: Int, image: String, largeImage: String): Item!
  updateItem(id:ID!, title: String, description: String, price: Int): Item!
   deleteItem(id: ID!): Item
   signup(email: String!, password: String!, name: String!): User!
   signin(email: String!, password: String!): User!
  signout: SuccessMessage
  requestReset(email: String!): SuccessMessage
  resetPassword(resetToken: String!, password: String!, confirmPassword: String!): User!
  updatePermissions(permissions: [Permission], userId: ID!): User
  addToCart(id: ID!): CartItem
  removeFromCart(id: ID!): CartItem
  createOrder(token: String!): Order!
}
type Query {
  items(where: ItemWhereInput, orderBy: ItemOrderByInput, skip: Int, first: Int): [Item]!
  item(where: ItemWhereUniqueInput!): Item
  itemsConnection(where: ItemWhereInput): ItemConnection!
  me: User 
   users: [User]!
  order(id: ID!): Order
  orders(orderBy: OrderOrderByInput): [Order]!
}
type User{
  id: ID!
  name: String!
  email: String!
  permissions: [Permission!]!
  cart: [CartItem!]!
  orders: [OrderItem]
}
```
