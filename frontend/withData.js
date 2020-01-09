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